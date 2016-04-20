var qtrOffset = [0, 0, 12, 24, 36, 48, 53, 58, 63]

d3.csv('subs.csv', function(res){
  subs = res

  subs.forEach(function(d){
    d.min = 12 - +d.time.split(':')[0] + d.time.split(':')[1]/60 + qtrOffset[d.qtr]
    d.isIn = d.isIn == 'true'
  })

  c = d3.conventions({width: 100})

  c.x.domain([0, 48])
  c.y.domain([0, 81])

  c.svg.dataAppend(subs, 'circle')
      .attr('cx', ƒ('min', c.x))
      .attr('cy', ƒ('gameIndex', c.y))
      .attr('fill', function(d){ return d.isIn ? 'green' : 'red'})
      .attr('r', 2)


})