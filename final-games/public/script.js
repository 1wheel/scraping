d3.csv('players.csv', function(res){
  players = res

  fPlayers = players.filter(function(d){ return d.round == 'Finals' && d.player })

  byPlayer = d3.nest().key(ƒ('player')).entries(fPlayers)

  byPlayer.forEach(function(d){
    d.series = d3.nest().key(ƒ('year')).entries(d.values)
  
    d.streaks = []
    var curStreak = [d.series[0].key]
    d.series.map(ƒ('key')).forEach(function(year, i){
      if (!i) return

      if (_.last(curStreak) == year - 1){
        curStreak.push(year)
      } else{
        d.streaks.push(curStreak)
        curStreak = [year]
      }
    })
    d.streaks.push(curStreak)

    d.maxStreak = d3.max(d.streaks, ƒ('length'))
    d.streaks.forEach(function(s){
      if (s.length == d.maxStreak) d.maxStreakStart = s[0]
    })

  })


  !(function(){
    var c = d3.conventions({width: 900})

    c.x.domain([0, byPlayer.length - 1])
    c.y.domain([0, d3.max(byPlayer, ƒ('series', 'length'))])

    c.drawAxis()

    c.svg.dataAppend(_.sortBy(byPlayer, ƒ('series', 'length')), 'circle')
        .attr('r', 2)
        .attr('cx', function(d, i){ return c.x(i) })
        .attr('cy', ƒ('series', 'length', c.y))
        .call(d3.attachTooltip)
  })()

  !(function(){
    var topPlayers = byPlayer.filter(function(d){ return d.series.length > 2 })
    var c = d3.conventions({width: 900})

    c.x.domain([0, topPlayers.length - 1])
    c.y.domain([0, d3.max(topPlayers, ƒ('series', 'length'))])

    c.drawAxis()

    c.svg.dataAppend(_.sortBy(topPlayers, ƒ('series', 'length')), 'circle')
        .attr('r', 2)
        .attr('cx', function(d, i){ return c.x(i) })
        .attr('cy', ƒ('series', 'length', c.y))
        .call(d3.attachTooltip)
  })()

  !(function(){
    //tktk - cluster?
    var topPlayers = byPlayer.filter(function(d){ return d.series.length > 2 })
    var c = d3.conventions({width: 900})

    c.x.domain([1, d3.max(topPlayers, ƒ('maxStreak'))])
    c.y.domain([0, d3.max(topPlayers, ƒ('series', 'length'))])

    c.drawAxis()

    c.svg.dataAppend(_.sortBy(topPlayers, ƒ('series', 'length')), 'circle')
        .attr('r', 2)
        .attr('cx', ƒ('maxStreak', c.x))
        .attr('cy', ƒ('series', 'length', c.y))
        .call(d3.attachTooltip)
        .translate(function(){ return [Math.random()*6, Math.random()*6] })
  })()

  !(function(){
    //tktk - cluster?
    var topPlayers = byPlayer.filter(function(d){ return d.series.length > 2 })
    var c = d3.conventions({width: 900})

    c.x.domain([1950, 2015])
    c.y.domain([1, d3.max(topPlayers, ƒ('maxStreak'))])

    c.xAxis.tickFormat(function(d){ return d })
    c.drawAxis()

    c.svg.dataAppend(topPlayers, 'circle')
        .attr('r', 3)
        .attr('cx', ƒ('maxStreakStart', c.x))
        .attr('cy', ƒ('maxStreak', c.y))
        .call(d3.attachTooltip)
        .translate(function(){ return [Math.random()*6, Math.random()*6] })
        // .style({stroke: 'black', fill: 'none'})
  })()

  //table(_.sortBy(byPlayer, ƒ('values', 'length')))
})