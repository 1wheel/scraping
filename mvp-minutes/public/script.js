var qtrOffset = [0, 0, 12, 24, 36, 48, 53, 58, 63]

d3.csv('subs.csv', function(res){
  subs = res

  subs.forEach(function(d){
    d.min = 12 - +d.time.split(':')[0] + d.time.split(':')[1]/60 + qtrOffset[d.qtr]
    d.isIn = d.isIn == 'true'
  })

  byGame = d3.nest().key(ƒ('gameIndex')).entries(subs)

  byGame.forEach(function(game){
    game.playBlocks = []
    isPlaying = true

    game.values.forEach(function(d){

    })
  })

  !(function(){
    c = d3.conventions({width: 100})

    c.x.domain([0, 48])
    c.y.domain([81, 0])

    c.svg.dataAppend(subs, 'circle')
        .attr('cx', ƒ('min', c.x))
        .attr('cy', ƒ('gameIndex', c.y))
        .attr('fill', function(d){ return d.isIn ? 'steelblue' : 'red'})
        .attr('r', function(d){ return d.time == '12:00' || d.time == '00.00' ? 1 : 3 })    
        .call(d3.attachTooltip)
  })()


  !(function(){
    c = d3.conventions({width: 1000})

    c.x.domain([0, 48])
    c.y.domain([81, 0])

    c.svg.dataAppend(subs, 'circle')
        .attr('cx', ƒ('min', c.x))
        .attr('cy', ƒ('gameIndex', c.y))
        .attr('fill', function(d){ return d.isIn ? 'green' : 'red'})
        .attr('r', 2)    
  })()


})