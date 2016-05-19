d3.csv('players.csv', function(res){
  players = res.filter(function(d){ return d.player && d.pts !== '' })

  players.forEach(function(d){ d.year = +d.year; d.pts = +d.pts })

  byPlayer = d3.nest().key(ƒ('player')).entries(players)

  gameToValues = d3.nest().key(ƒ('game')).object(players)


  byPlayer.forEach(function(d){
    d.series = d3.nest().key(function(d){ return d.year + '-' + d.round }).entries(d.values)

    d.series.forEach(function(d){
      d.isFinals = d.values[0].round == 'Finals'
      d.team = d.values[0].team
      d.year = d.values[0].year
    })

    d.finalSeries = d.series.filter(ƒ('isFinals'))

    d.firstYear = d.series[0].year
    d.lastYear  = _.last(d.series).year

    d.firstTeam = d.series[0].team


    d.years = d3.nest().key(ƒ('year')).entries(d.values)

    d.rollingYears = d3.range(d.firstYear, d.lastYear + 1).map(function(year){
      var rv = {year: year}
      rv.prev3Years = d.years.filter(function(d){ return d.key == year || d.key == year - 1 || d.key == year - 2 })
      rv.prev3YearGames = d3.sum(rv.prev3Years, ƒ('values', 'length'))
      rv.prev6Years = d.years.filter(function(d){ return year - 5 <= d.key && d.key <= year })
      rv.prev6YearGames = d3.sum(rv.prev6Years, ƒ('values', 'length'))
      rv.prevYears = d.years.filter(function(d){ return d.key <= year })
      rv.prevYearGames = d3.sum(rv.prevYears, ƒ('values', 'length'))

      return rv
    })
  })

  topPlayers = byPlayer.filter(function(d){ return d.values.length > 60 })



  d3.select('body').append('h2').text('# playoff games v # finals series, more than 60 playoff games')
  !(function(){
    var c = d3.conventions({width: 900})

    c.x.domain([60, d3.max(topPlayers, ƒ('values', 'length'))])
    c.y.domain([0, d3.max(topPlayers, ƒ('finalSeries', 'length'))])

    var r = d3.scaleLinear().domain([1, 12]).range([1, 15])

    c.xAxis.tickFormat(function(d){ return d })
    c.drawAxis()

    var simulation = d3.forceSimulation(topPlayers)
        .force('x', d3.forceX(ƒ('values', 'length', c.x)))
        .force('y', d3.forceY(ƒ('finalSeries', 'length', c.y)))
        .force('collide', d3.forceCollide(3.8))
        .stop()

    for (var i = 0; i < 120; ++i) simulation.tick()

    c.svg.dataAppend(topPlayers, 'circle')
        .attr('r', 4)
        .call(d3.attachTooltip)
        .translate(function(d){ return [d.x, d.y] })
        .call(setColor, ƒ('firstTeam', teamColor))
  })()

  d3.select('body').append('h2').text('# playoff games per year, more than 60 playoff games total')
  !(function(){
    var c = d3.conventions({width: 900})

    c.x.domain([1955, 2015])
    c.y.domain([0, 30])

    var r = d3.scaleLinear().domain([1, 12]).range([1, 15])

    c.xAxis.tickFormat(function(d){ return d })
    c.drawAxis()

    var line = d3.line().x(ƒ('key', c.x)).y(ƒ('values', 'length', c.y))

    c.svg.dataAppend(topPlayers, 'path')
        .styles({fill: 'none', stroke: ƒ('firstTeam', teamColor)})
        .attr('d', ƒ('years', line))
        .call(d3.attachTooltip)
  })()


  d3.select('body').append('h2').text('# playoff games per year w/ rolling 6 year avg, more than 60 playoff games total')
  !(function(){
    var c = d3.conventions({width: 900})

    c.x.domain([1955, 2015])
    c.y.domain([0, 180])

    var r = d3.scaleLinear().domain([1, 12]).range([1, 15])

    c.xAxis.tickFormat(function(d){ return d })
    c.drawAxis()

    var line = d3.line().x(ƒ('year', c.x)).y(ƒ('prev6YearGames', c.y))

    c.svg.dataAppend(topPlayers, 'path')
        .styles({fill: 'none', stroke: ƒ('firstTeam', teamColor)})
        .attr('d', ƒ('rollingYears', line))
        .call(d3.attachTooltip)
  })()


  d3.select('body').append('h2').text('# cumulative playoff games, more than 60 playoff games total')
  !(function(){
    var c = d3.conventions({width: 900})

    c.x.domain([1955, 2015])
    c.y.domain([0, 250])

    var r = d3.scaleLinear().domain([1, 12]).range([1, 15])

    c.xAxis.tickFormat(function(d){ return d })
    c.drawAxis()

    var line = d3.line().x(ƒ('year', c.x)).y(ƒ('prevYearGames', c.y))

    c.svg.dataAppend(topPlayers, 'path')
        .styles({fill: 'none', stroke: ƒ('firstTeam', teamColor)})
        .attr('d', ƒ('rollingYears', line))
        .call(d3.attachTooltip)
  })()




})

function add(num){ return function(d){ return d + num }}

function setColor(sel, fn){
  // sel.styles({fill: fn, stroke: fn, 'fill-opacity': .5})
  sel.styles({fill: fn})
}

function teamColor(d){
  var map = {
    'LAL': 'gold',
    'BOS': 'green',
    'CHI': 'red',
    'MIA': 'darkred',
    'DET': 'steelblue',
    'NYK': 'orange',
    'SAS': 'black',
    'CLE': 'brown'
  }

  return map[d] || 'lightgrey'
}
