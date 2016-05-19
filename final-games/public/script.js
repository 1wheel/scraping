d3.csv('players.csv', function(res){
  players = res

  fPlayers = players.filter(function(d){ return d.round == 'Finals' && d.player && d.pts !== '' })

  byPlayer = d3.nest().key(ƒ('player')).entries(fPlayers)

  byPlayer.forEach(function(d){
    d.series = d3.nest().key(ƒ('year')).entries(d.values)
  
    d.streaks = []
    var curStreak = [d.series[0]]
    d.series.forEach(function(year, i){
      if (!i) return

      if (_.last(curStreak).key == year.key - 1){
        curStreak.push(year)
      } else{
        d.streaks.push(curStreak)
        curStreak = [year]
      }
    })
    d.streaks.push(curStreak)

    d.streaks.forEach(function(d){
      d.pts = d3.mean(_.flatten(d.map(ƒ('values'))), ƒ('pts'))
      d.team = d[0].values[0].team
      d.start = d[0].key
    })
    
    d.maxStreak = _.max(d.streaks, ƒ('length'))
    d.maxStreakStart = d.maxStreak[0].key
    d.maxStreakPts = d.maxStreak.pts
    d.maxStreakTeam = d.maxStreak[0].values[0].team
  })

  topPlayers = byPlayer.filter(function(d){ return d.series.length > 2 })


  //table(_.sortBy(d3.nest().key(ƒ()).entries(topPlayers.map(ƒ('maxStreakTeam'))), ƒ('values', 'length')).reverse())
  function teamColor(d){
    var map = {
      'LAL': 'gold',
      'BOS': 'green',
      'CHI': 'darkred',
      'MIA': 'red',
      'DET': 'darkblue',
      'NYK': 'orange'
    }

    return map[d] || 'lightgrey'
  }

  //table(_.sortBy(byPlayer, ƒ('values', 'length')))



  d3.select('body').append('h2').text('distribution of # finals series a player played in')
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

  d3.select('body').append('h2').text('distribution of # finals series players w/ at least 3 played in')
  !(function(){
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

  d3.select('body').append('h2').text('most consecutive finals v total finals')
  !(function(){
    var c = d3.conventions({width: 900})

    c.x.domain([1, d3.max(topPlayers, ƒ('maxStreak', 'length'))])
    c.y.domain([2, d3.max(topPlayers, ƒ('series', 'length'))])

    c.drawAxis()

    var simulation = d3.forceSimulation(topPlayers)
        .force('x', d3.forceX(ƒ('maxStreak', 'length', c.x)))
        .force('y', d3.forceY(ƒ('series', 'length', c.y)))
        .force('collide', d3.forceCollide(4))
        .stop()

    for (var i = 0; i < 120; ++i) simulation.tick()


    c.svg.dataAppend(topPlayers, 'circle')
        .attr('r', 3)
        .call(d3.attachTooltip)
        .translate(function(d){ return [d.x, d.y] })
        .style('fill', ƒ('maxStreakTeam', teamColor))
  })()

  d3.select('body').append('h2').text('# of consecutive finals overtime')
  !(function(){
    var c = d3.conventions({width: 900})

    c.x.domain([1950, 2015])
    c.y.domain([1, d3.max(topPlayers, ƒ('maxStreak', 'length'))])

    c.xAxis.tickFormat(function(d){ return d })
    c.drawAxis()

    c.svg.dataAppend(topPlayers, 'circle')
        .attr('r', 3)
        .attr('cx', ƒ('maxStreakStart', c.x))
        .attr('cy', ƒ('maxStreak', 'length', c.y))
        .call(d3.attachTooltip)
        .translate(function(){ return [Math.random()*6, Math.random()*6] })
        .styles({stroke: 'black', fill: 'none'})
  })()

  d3.select('body').append('h2').text('# of consecutive finals overtime - sized by avg points scored')
  !(function(){
    var c = d3.conventions({width: 900})

    c.x.domain([1950, 2015])
    c.y.domain([1, d3.max(topPlayers, ƒ('maxStreak', 'length'))])

    var r = d3.scaleLinear().domain([0, 40]).range([.5, 20])

    c.xAxis.tickFormat(function(d){ return d })
    c.drawAxis()

    var simulation = d3.forceSimulation(topPlayers)
        .force('x', d3.forceX(ƒ('maxStreakStart', c.x)))//.strength(1))
        .force('y', d3.forceY(ƒ('maxStreak', 'length', c.y)))
        .force('collide', d3.forceCollide(ƒ('maxStreakPts', r, add(.5))))
        .stop()

    for (var i = 0; i < 120; ++i) simulation.tick()


    c.svg.dataAppend(topPlayers, 'circle')
        .attr('r', ƒ('maxStreakPts', r))
        .call(d3.attachTooltip)
        .translate(function(d){ return [d.x, d.y] })
        .style('fill', ƒ('maxStreakTeam', teamColor))


  })()

  d3.select('body').append('h2').text('# of consecutive finals overtime - sized by avg points scored')
  !(function(){
    var c = d3.conventions({width: 900})

    var streaks = _.flatten(byPlayer.map(ƒ('streaks'))).filter(function(d){ return d.length > 1 })


    c.x.domain([1950, 2015])
    c.y.domain([1, d3.max(streaks, ƒ('length'))])

    var r = d3.scaleLinear().domain([0, 40]).range([.5, 20])

    c.xAxis.tickFormat(function(d){ return d })
    c.drawAxis()

    var simulation = d3.forceSimulation(streaks)
        .force('x', d3.forceX(ƒ('start', c.x)))//.strength(1))
        .force('y', d3.forceY(ƒ('length', c.y)))
        .force('collide', d3.forceCollide(ƒ('pts', r, add(.5))))
        .stop()

    for (var i = 0; i < 120; ++i) simulation.tick()


    c.svg.dataAppend(streaks, 'circle')
        .attr('r', ƒ('pts', r))
        .call(d3.attachTooltip)
        .translate(function(d){ return [d.x, d.y] })
        .style('fill', ƒ('team', teamColor))


  })()


})

function add(num){ return function(d){ return d + num }}