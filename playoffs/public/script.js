// d3.tsv('data.tsv', function(data){
//   c = d3.conventions({parentSel: d3.select('#graph')})

//   c.x.domain(d3.extent(data, ƒ('sepalWidth')) ).nice()
//   c.y.domain(d3.extent(data, ƒ('sepalLength'))).nice()
//   c.drawAxis()

//   c.svg.dataAppend(data, 'circle')
//       .attr('cx', ƒ('sepalWidth', c.x))
//       .attr('cy', ƒ('sepalLength',c.y))
//       .attr('fill', ƒ('species', c.color))
//       .attr({r: 5, stroke: '#000'})
//       .call(d3.attachTooltip)

//   var legend = c.svg.dataAppend(c.color.domain(), 'g.legend')
//       .translate(function(d, i){ return [0, i*20] })

//   legend.append('rect')
//       .attr({x: c.width - 18, width: 18, height: 18})
//       .style('fill', c.color)

//   legend.append('text')
//       .attr({x: c.width - 24, y: 9, dy: '.33em', 'text-anchor': 'end'})
//       .text(ƒ())
// })


d3.csv('playoff-games.csv', function(data){
  games = data

  games.forEach(function(d){
    d.year = +d.year
    d.homePoints = +d.homePoints
    d.awayPoints = +d.awayPoints
    d.winner = d.homePoints > d.awayPoints ? d.home : d.away
  })

  byYear = d3.nest().key(ƒ('year')).entries(games)

  byYear.forEach(function(year){
    year.key = +year.key
    year.series = d3.nest()
      .key(function(d){
        return [d.home, d.away].sort() })
      .entries(year.values)

    year.series.forEach(function(d){
      d.higherSeed = d.values[0].home

      if (year.key < 1971) return
      d.tie = d.values[0].winner == d.values[1].winner
    })

    year.firstRound = year.series.slice(0, 8)
    year.ties = d3.sum(year.firstRound, ƒ('tie'))
  })

  !(function(){
    var fullYears = byYear.filter(function(d){ return d.key > 1974 })
    c = d3.conventions({parentSel: d3.select('#graph')})

    c.x.domain(d3.extent(fullYears, ƒ('key')))
    c.y.domain(d3.extent(fullYears, ƒ('ties')))
    c.y.domain([0, 8])
  
    c.drawAxis()

    c.svg.dataAppend(fullYears, 'circle')
        .attr('r', 10)
        .attr('cx', ƒ('key', c.x))
        .attr('cy', ƒ('ties', c.y))
        .call(d3.attachTooltip)
  })()

})
