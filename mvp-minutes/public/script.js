var qtrOffset = [0, 12, 24, 36, 48, 53, 58, 63]

d3.json('players.json', function(res){
  players = res

  players.forEach(function(player){
    if (!player.subs) return

    player.subs.forEach(function(d){
      d.min = -+d.time.split(':')[0] - +d.time.split(':')[1]/60 + qtrOffset[d.qtr]
      d.isIn = d.isIn == 'true'
      d.gameIndex = +d.gameIndex + 1
    })

    player.byGame = d3.nest().key(ƒ('gameIndex')).entries(player.subs)

    player.byGame.forEach(function(game){
      game.playBlocks = []
      isPlaying = true

      game.values.forEach(function(d, i){
        if (i % 2) game.playBlocks.push({start: game.values[i - 1], end: d})
      })

      game.playBlocks.forEach(function(d){
        d.correctOrder = d.start.isIn && !d.end.isIn
      })
      
      game.correctOrder = game.playBlocks.every(ƒ('correctOrder'))
    })

    //calculate minute played blocks
    player.gamesPlayed = player.byGame.length
    player.minutesPlayed = d3.range(0, 48).map(function(d){ return 0 })

    _.flatten(player.byGame.map(ƒ('playBlocks'))).forEach(function(d){
      var firstMin = Math.ceil(d.start.min)
      var lastMin  = Math.floor(d.end.min)
      d3.range(firstMin, lastMin).forEach(function(min){
        player.minutesPlayed[min]++
        // player.minutesPlayed[lastMin] += d.end.min - lastMin
        // player.minutesPlayed[Math.floor(d.start.min)] += firstMin - d.start.min
      })
    })

    player.minutesPlayed = player.minutesPlayed.slice(0, 48)


    var playedGames = {}
    player.byGame.forEach(function(d){ playedGames[d.key] = true })
    d3.range(1, 83).forEach(function(d){
      if (!playedGames[d]) player.byGame.push({key: d, values: [], playBlocks: []}) 
    })




    //sm
    !(function(){
      var sel = d3.select('#sm-graph').append('div').style({display: 'inline-block', 'margin-bottom': '10px'})

      c = d3.conventions({width: 82*2.5, height: 70, parentSel: sel})
      sel.append('h3').text(player.year + ' - ' + player.fullName)
          .style({'text-align': 'center', 'margin-top': '-15px'})
      c.svg.datum(player)

      c.x.domain([0, 83])
      c.y.domain([48, 0])

      var gameSel = c.svg.dataAppend(player.byGame, 'g.game')
          .translate(function(d){ return [c.x(d.key), 0] })
          .style('opacity', function(d){
            return d.correctOrder ? 1 : 1
          })
      
      gameSel.append('path')
          .attr('d', ['M0,', c.y(0), 'V', c.y(48)].join(' '))
          .style('stroke', 'red')
          .style('stroke-width', 1.5)
          .style('opacity', .15)
          
      gameSel.filter(ƒ('values', 'length')).append('path')
          .attr('d', ['M0,', c.y(42), 'V', c.y(48)].join(' '))
          .style('stroke', 'red')
          .style('stroke-width', 1.5)

      gameSel.dataAppend(ƒ('playBlocks'), 'path.block')
          .attr('d', function(d){
            return ['M0,', c.y(d.start.min), 'V', c.y(d.end.min)].join(' ') })
          .style('stroke', '#666')
          .style('stroke-width', 1.5)

      c.xAxis.orient('top').tickValues([41, 82])
      c.yAxis.tickValues([12, 24, 36, 48]).tickSize(c.width)
      c.drawAxis()
      c.svg.select('.x').translate([0, 0])
      c.svg.select('.y').translate([c.width, 0])
    })()

    //play time
    !(function(){
      var sel = d3.select('#sm-percent').append('div')
          .style({display: 'inline-block', 'margin-bottom': '10px'})

      c = d3.conventions({width: 82*2.5, height: 70, parentSel: sel})
      sel.append('h3').text(player.year + ' - ' + player.fullName)
          .style({'text-align': 'center', 'margin-top': '0px'})
      c.svg.datum(player)

      c.x.domain([0, 48])
      c.y.domain([0, 1])

      c.xAxis.tickValues([12, 24, 36, 48])
      c.yAxis.ticks(3).tickFormat(d3.format('%'))
      c.drawAxis()

      c.svg.append('rect')
          .style('fill', 'red')
          .attr({width: c.x(47), height: c.height})

      c.svg.append('rect')
          .style('fill', 'pink')
          .attr({width: c.x(43), height: c.height})
          

      var area = d3.svg.area()
          .x(function(d, i){ return c.x(i) })
          .y0(function(d){ return c.y(d/player.gamesPlayed) })
          .y1(c.height)
          .interpolate('step')

      c.svg.append('path')
          .attr('d', area(player.minutesPlayed))
          .style('fill', '#666')



    })()

  })
})


d3.csv('subs.csv', function(res){
  subs = res

  subs.forEach(function(d){
    d.min = -+d.time.split(':')[0] - +d.time.split(':')[1]/60 + qtrOffset[d.qtr]
    d.isIn = d.isIn == 'true'
    d.gameIndex = +d.gameIndex + 1
  })

  byGame = d3.nest().key(ƒ('gameIndex')).entries(subs)

  byGame.forEach(function(game){
    game.playBlocks = []
    isPlaying = true

    game.values.forEach(function(d, i){
      if (i % 2) game.playBlocks.push({start: game.values[i - 1], end: d})
    })

    game.playBlocks.forEach(function(d){
      d.correctOrder = d.start.isIn && !d.end.isIn
    })
    
    game.correctOrder = game.playBlocks.every(ƒ('correctOrder'))
  })
  
  //insert games that were sat
  playedGames = {}
  byGame.forEach(function(d){ playedGames[d.key] = true })
  d3.range(1, 83).forEach(function(d){
    if (!playedGames[d]) byGame.push({key: d, values: [], playBlocks: []}) 
  })
  
  !(function(){
    c = d3.conventions({width: 400, height: 100})

    c.x.domain([0, 48])
    c.y.domain([81, 0])

    c.svg.dataAppend(subs, 'circle')
        .attr('cx', ƒ('min', c.x))
        .attr('cy', ƒ('gameIndex', c.y))
        .attr('fill', function(d){ return d.isIn ? 'steelblue' : 'red'})
        .attr('r', function(d){ return d.time == '12:00' || d.time == '00:00' ? 1 : 3 })
        .call(d3.attachTooltip)
  })//()

  var sel = d3.select('#curry-debug').append('div')
  !(function(){
    sel.append('h1').text('small multiple prototype')
    c = d3.conventions({width: 82*3.5, height: 140, parentSel: sel})

    c.x.domain([0, 83])
    c.y.domain([48, 0])

    var gameSel = c.svg.dataAppend(byGame, 'g.game')
        .translate(function(d){ return [c.x(d.key), 0] })
        .style('opacity', function(d){
          return d.correctOrder ? 1 : 1
        })
    
    gameSel.append('path')
        .attr('d', ['M0,', c.y(0), 'V', c.y(48)].join(' '))
        .style('stroke', 'red')
        .style('stroke-width', 2)
        .style('opacity', .15)
        
    gameSel.filter(ƒ('values', 'length')).append('path')
        .attr('d', ['M0,', c.y(42), 'V', c.y(48)].join(' '))
        .style('stroke', 'red')
        .style('stroke-width', 2)

    gameSel.dataAppend(ƒ('playBlocks'), 'path.block')
        .attr('d', function(d){
          return ['M0,', c.y(d.start.min), 'V', c.y(d.end.min)].join(' ') })
        .style('stroke', '#666')
        .style('stroke-width', 2)

    c.xAxis.orient('top').tickValues([41, 82])
    c.yAxis.tickValues([12, 24, 36, 48]).tickSize(c.width)
    c.drawAxis()
    c.svg.select('.x').translate([0, 0])
    c.svg.select('.y').translate([c.width, 0])
    
  })()


  !(function(){
    sel.append('h1').text('debug playing blocks')
    c = d3.conventions({width: 400, parentSel: sel})

    c.x.domain([0, 48])
    c.y.domain([81, 0])
    
    c.drawAxis()

    var gameSel = c.svg.dataAppend(byGame, 'g.game')
        .translate(function(d){ return [0, c.y(d.key)] })
        .style('opacity', function(d){
          return d.correctOrder ? 1 : 1
        })

    gameSel.dataAppend(ƒ('playBlocks'), 'path')
        .attr('d', function(d){
          return ['M', c.x(d.start.min), ',0H', c.x(d.end.min)].join(' ') })
        .style('stroke', function(d){ return d.correctOrder ? '#ccc' : 'pink' })

    gameSel.dataAppend(ƒ('values'), 'circle')
        .attr('cx', ƒ('min', c.x))
        // .attr('cy', ƒ('gameIndex', c.y))
        .attr('fill', function(d){ return d.isIn ? 'steelblue' : 'red'})
        .attr('r', function(d){ return d.time == '12:00' || d.time == '00:00' ? 1 : 3 })
        .call(d3.attachTooltip)
        
    d3.select('body').append('h1')
        .text('bad order: ' +  d3.sum(byGame, function(d){ return !d.correctOrder }))
  })()
})