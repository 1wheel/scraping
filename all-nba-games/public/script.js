color = d3.scale.threshold()
    .domain([-13, -5, 0, 1, 6, 14])
    // .range(["#b35806","#f1a340","#fee0b6","#f7f7f7","#d8daeb","#998ec3","#542788"])
    .range(["#b35806","#f1a340","#fee0b6","rgba(0,0,0,0)","#d8daeb","#998ec3","#542788"].reverse())

d3.select('#graph').append('div').style('margin-bottom', '20px').dataAppend(d3.range(-18, 18), 'div.key')
    .text(ƒ())
    .style('background', color)

d3.json('games.json', function(res){
  //only 2015
  games = res.filter(function(d){ return d.date[3] == '5' })

  teamGames = []
  games.forEach(function(game){
    game.team = game.away
    game.oppTeam = game.home
    teamGames.push(game)
    game.date = game.date.split('T')[0].replace('2015-', '').replace('-', '/')

    var flippedGame = {team: game.home, oppTeam: game.away, isFlipped: true, date: game.date}
    flippedGame.minutes = game.minutes.map(function(d){
        d.dif = d.h - d.v
        d.game = game
        return {min: d.min, dif: -d.dif, game: flippedGame, h: d.v, v: d.h}
      })
    teamGames.push(flippedGame)
  })


  byTeam = d3.nest().key(ƒ('team')).entries(teamGames)

  byTeam.forEach(function(team){
    team.byMinute = d3.nest().key(ƒ('min')).entries(_.flatten(team.values.map(ƒ('minutes'))))
    team.byMinute.forEach(function(minute){
      minute.values = _.sortBy(minute.values, 'dif')//.reverse()
      minute.numNeg = minute.values.filter(function(d){ return d.dif <  0 }).length
      minute.numTie = minute.values.filter(function(d){ return d.dif == 0 }).length
      minute.values.forEach(function(d, i){
        d.y = (i - Math.floor(minute.numTie/2) - minute.numNeg)
        d.i = i
      })
    })
    team.wins = team.values.filter(function(d){ return _.last(d.minutes).dif > 0 }).length
  })

  teamSel = d3.select('#graph').dataAppend(_.sortBy(byTeam, 'wins').reverse(), 'div.game')
  teamSel.append('div').text(ƒ('key'))//.style({'z-index': 3, position: 'relative'})

  teamSel.each(function(d, i){
    if (i > 4) return
    var c = d3.conventions({
      parentSel: d3.select(this),
      height: 150, width: 190, 
      margin: {left: 10, top: 10, bottom: 10, right: 10}})

    c.x.domain([48, 0])
    c.y.domain([-20, 20])
    c.yAxis.tickValues([-15, 0, 15])
    c.yAxis.tickValues([])
    c.xAxis.tickValues([48, 36, 24, 12, 0])

    c.drawAxis()

    c.svg.selectAll('.x line').attr('y1', -c.height)
    // c.svg.append('path.zero').attr('d', ['M', [0, c.y(0)], 'h', c.width].join(''))


    var minuteSel = c.svg.dataAppend(d.byMinute, 'g.min')
        .translate(function(d){ return [c.x(d.key), c.y(-Math.floor(d.numTie/2) - d.numNeg) - c.y(0)] })

    var line = d3.svg.line()
        .x(ƒ('min', c.x))
        .y(function(d){ return c.y(d.y) })
        .interpolate('step')

    var lineSel = c.svg.append('path.hover-path')
    var textG = c.svg.append('g.hover-text')
    var dateText  = textG.append('text').attr('y', '-1.1em')
    var oppText  = textG.append('text').attr('y', '-2.2em')
    var scoreText = textG.append('text')

    var botTextG = c.svg.append('g.hover-text')
    var botScore = botTextG.append('text').attr({'text-anchor': 'middle', 'y': '2.81em'})
    var botTime = botTextG.append('text').attr({'text-anchor': 'middle', 'y': '1.45em'})
    var circleSel = minuteSel.dataAppend(ƒ('values'), 'circle')
        .attr('cy', ƒ('i', c.y))
        .attr('r', 2)
        .attr('fill', ƒ('dif', color))
        .on('mouseover', function(d){
          console.log(d)
          lineSel.attr('d', line(d.game.minutes))

          circleSel.classed('selected', function(e){ return e.game == d.game })
          
          var finalScore = _.last(d.game.minutes)
          textG.translate([c.width + 3, c.y(finalScore.y)])
          oppText.text((d.game.isFlipped ? ' ' : '@') + d.game.oppTeam)
          dateText.text(d.game.date)
          scoreText.text(finalScore.h + '-' + finalScore.v)


          botTextG.translate([c.x(d.min), c.height])
          botTime.text(d.min)
          botScore.text(d.h + '-' + d.v)

        })
        // .call(d3.attachTooltip)




  })

  d3.select(self.frameElement).style("height", 2000 + "px");
})

function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }
