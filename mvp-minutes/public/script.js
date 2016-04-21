var qtrOffset = [0, 0, 12, 24, 36, 48, 53, 58, 63]

d3.csv('subs.csv', function(res){
  subs = res

  subs.forEach(function(d){
    d.min = 12 - +d.time.split(':')[0] - +d.time.split(':')[1]/60 + qtrOffset[d.qtr]
    d.isIn = d.isIn == 'true'
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

  !(function(){
    c = d3.conventions({width: 400})

    c.x.domain([0, 48])
    c.y.domain([81, 0])

    c.svg.dataAppend(subs, 'circle')
        .attr('cx', ƒ('min', c.x))
        .attr('cy', ƒ('gameIndex', c.y))
        .attr('fill', function(d){ return d.isIn ? 'steelblue' : 'red'})
        .attr('r', function(d){ return d.time == '12:00' || d.time == '00:00' ? 1 : 3 })
        .call(d3.attachTooltip)
  })//()


  !(function(){
    d3.select('body').append('h1').text('playing blocks')
    c = d3.conventions({width: 400})

    c.x.domain([0, 48])
    c.y.domain([81, 0])

    var gameSel = c.svg.dataAppend(byGame, 'g.game')
        .translate(function(d){ return [0, c.y(d.key)] })
        .style('opacity', function(d){
          return d.correctOrder ? .3 : 1
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