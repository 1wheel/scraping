var qtrOffset = [0, 12, 24, 36, 48, 53, 58, 63]

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

  !(function(){
    d3.select('body').append('h1').text('small multiple prototype')
    c = d3.conventions({width: 82*3.5, height: 100})

    c.x.domain([0, 82])
    c.y.domain([48, 0])

    c.xAxis.orient('top').tickValues([41, 82])
    c.yAxis.tickValues([0, 12, 24, 36, 48])
    c.drawAxis()
    c.svg.select('.x').translate([0, 0])
    
    var gameSel = c.svg.dataAppend(byGame, 'g.game')
        .translate(function(d){ return [c.x(d.key), 0] })
        .style('opacity', function(d){
          return d.correctOrder ? 1 : 1
        })
    
    gameSel.append('path')
        .attr('d', ['M0,', c.y(0), 'V', c.y(48)].join(' '))
        .style('stroke', '#ddd')
        .style('stroke-width', 2)

    gameSel.dataAppend(ƒ('playBlocks'), 'path.block')
        .attr('d', function(d){
          return ['M0,', c.y(d.start.min), 'V', c.y(d.end.min)].join(' ') })
        .style('stroke', '#333')
        .style('stroke-width', 2)

    // gameSel.dataAppend(ƒ('values'), 'circle')
    //     .attr('cx', ƒ('min', c.x))
    //     // .attr('cy', ƒ('gameIndex', c.y))
    //     .attr('fill', function(d){ return d.isIn ? 'steelblue' : 'red'})
    //     .attr('r', function(d){ return d.time == '12:00' || d.time == '00:00' ? 1 : 3 })
    //     .call(d3.attachTooltip)
  })()


  !(function(){
    d3.select('body').append('h1').text('debug playing blocks')
    c = d3.conventions({width: 400})

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