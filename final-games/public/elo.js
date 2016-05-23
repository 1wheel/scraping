d3.json('finals-elo.json', function(res){
  finalsTeams = res//.filter(function(d){ return d.year > 1955 })

  finalsTeams.forEach(function(d){
    d.eloOpp = d3.mean(d.rounds.map(ƒ('eloOpp')))
    d.maxEloOpp = d3.max(d.rounds.map(ƒ('eloOpp')))
    d.minEloOpp = d3.min(d.rounds.map(ƒ('eloOpp')))
  })

  eastTeams = finalsTeams.filter(function(d){ return !d.isWest })
  westTeams = finalsTeams.filter(function(d){ return  d.isWest })

  d3.select('body').append('h2').text('Path to the finals: Average ELO of East and West conference opponents')
  !(function(){
    var c = d3.conventions({width: 700, margin: {left: 40, top: 20, bottom: 20, right: 20}})

    c.x.domain([1950, 2015])
    c.y.domain([1350, 1700])

    c.xAxis.tickFormat(function(d){ return d })
    c.drawAxis()

    var line = d3.line().x(ƒ('year', c.x)).y(ƒ('eloOpp', c.y))

    c.svg.append('rect').attrs({width: c.x(2016) - c.x(2011), height: c.height, x: c.x(2011) })
      .style('fill', 'lightgrey')

    c.svg.append('g').dataAppend([eastTeams, westTeams], 'path')
        .attr('d', line)
        .style('stroke', function(d, i){ return i ? 'red' : 'steelblue' })
        .style('stroke-width', 2)
        .style('fill', 'none')

    c.svg.append('g').dataAppend(_.flatten(eastTeams.map(ƒ('rounds'))), 'circle')
        .attr('cx', ƒ('year', c.x))
        .attr('cy', ƒ('eloOpp', c.y))
        .attr('r', 2)
        .styles({'fill-opacity': 0, stroke: 'steelblue'})
        .call(d3.attachTooltip)

    c.svg.append('g').dataAppend(_.flatten(westTeams.map(ƒ('rounds'))), 'circle')
        .attr('cx', ƒ('year', c.x))
        .attr('cy', ƒ('eloOpp', c.y))
        .attr('r', 2)
        .styles({'fill-opacity': 0, stroke: 'red'})
        .call(d3.attachTooltip)

  })()

  d3.select('body').append('h2').text('Since 2000')
  !(function(){
    var c = d3.conventions({width: 700, margin: {left: 40, top: 20, bottom: 20, right: 20}})

    c.x.domain([2000, 2015])
    c.y.domain([1400, 1780])

    c.xAxis.tickFormat(function(d){ return d })
    c.drawAxis()

    var line = d3.line().x(ƒ('year', c.x)).y(ƒ('eloOpp', c.y))

    c.svg.append('rect').attrs({width: c.x(2016) - c.x(2011), height: c.height, x: c.x(2011) })
      .style('fill', 'lightgrey')

    c.svg.append('g').dataAppend([eastTeams, westTeams], 'path')
        .attr('d', line)
        .style('stroke', function(d, i){ return i ? 'red' : 'steelblue' })
        .style('stroke-width', 0)
        .style('fill', 'none')

    c.svg.append('g').dataAppend(_.flatten(eastTeams.map(ƒ('rounds'))), 'circle')
        .attr('cx', ƒ('year', c.x))
        .attr('cy', ƒ('eloOpp', c.y))
        .translate([2, 0])
        .attr('r', 3)
        .styles({'fill-opacity': 0, stroke: 'steelblue'})
        .call(d3.attachTooltip)

    c.svg.append('g').dataAppend(_.flatten(westTeams.map(ƒ('rounds'))), 'circle')
        .attr('cx', ƒ('year', c.x))
        .attr('cy', ƒ('eloOpp', c.y))
        .translate([-2, 0])
        .attr('r', 3)
        .styles({'fill-opacity': 0, stroke: 'red'})
        .call(d3.attachTooltip)


    c.svg.append('g').dataAppend(eastTeams, 'path')
        .translate(function(d){ return [c.x(d.year) + 5, 0] })
        .attr('d', function(d){ return ['M0,', c.y(d.maxEloOpp), 'L0,', c.y(d.minEloOpp)].join('') })
        .style('stroke', 'steelblue')
    c.svg.append('g').dataAppend(westTeams, 'path')
        .translate(function(d){ return [c.x(d.year) - 5, 0] })
        .attr('d', function(d){ return ['M0,', c.y(d.maxEloOpp), 'L0,', c.y(d.minEloOpp)].join('') })
        .style('stroke', 'red')
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
