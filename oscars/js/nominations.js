loadData(function(data){
  drawAvgNom(d3.select('body'), _.filter(data, {award: "DIRECTING"}), 'Best Director')
  drawAvgNom(d3.select('body'), _.filter(data, {award: "ACTRESS"}), 'Best Actress')
  drawAvgNom(d3.select('body'), _.filter(data, {award: "ACTOR"}), 'Best Actor')

  drawByActor(d3.select('body'), _.filter(data, {award: "DIRECTING"}), 'Best Director')
  drawByActor(d3.select('body'), _.filter(data, {award: "ACTRESS"}), 'Best Actress')
  drawByActor(d3.select('body'), _.filter(data, {award: "ACTOR"}), 'Best Actor')
})


function drawAvgNom(sel, nominations, str){
  sel.append('h5').text(str)

  var svg = sel.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scale.linear().domain(d3.extent(nominations, f('nth')))    .range([0, width])
  var y = d3.scale.linear().domain(d3.extent(nominations, f('numPrev'))).range([height, 0])
  var line = d3.svg.line().x(_.compose(x, f('key'))).y(_.compose(y, f('avgPrev')))

  nominations = _.sortBy(nominations, 'won')

  d3.nest().key(function(d){ return d.nth + ' - ' +  d.numPrev }).entries(nominations).forEach(function(year){
    _.sortBy(year.values, 'won').forEach(function(d, i){
      d.offset = i*2
      d.xPos = x(d.nth)     + d.offset/2
      d.yPos = y(d.numPrev) - d.offset
      if (d.won) year.winPrev = d.numPrev
    })

    year.avgPrev = d3.mean(year.values, f('numPrev'))
  })

  var byYear = d3.nest().key(f('nth')).entries(nominations)
  byYear.forEach(function(year){
    year.prevWin = _.findWhere(year.values, {won: true}).numPrev
    year.prevNom = d3.mean(year.values, f('numPrev'))
  })
  var smoothing = 15
  byYear.forEach(function(d, i){
    var smoothYears = byYear.slice(Math.max(0, i - smoothing), i + 1)
    d.smoothWin = d3.mean(smoothYears, f('prevWin'))
    d.smoothNom = d3.mean(smoothYears, f('prevNom'))
  })

  var byName = d3.nest().key(f('name')).entries(_.sortBy(nominations, 'nth'))
      .map(f('values'))
      .filter(function(d){ return d.length > 4})

  svg.selectAll('all-career')
      .data(byName).enter()
    .append('path.all-career')  
      .attr('d', d3.svg.line().x(f('xPos')).y(f('yPos')))

  svg.selectAll('agg-path')
      .data(['prevWin', 'prevNom', 'smoothWin', 'smoothNom']).enter()
    .append('path')
      .attr('d', function(d){
        return line.y(_.compose(y, f(d)))(byYear) })
      .attr('class', f())
      .classed('agg-path', true)

  var career = svg.append('path.career')

  svg.selectAll('circle')
      .data(nominations).enter()
    .append('circle.nom').classed('won', f('won'))
      .attr('r', 4)
      .attr('cx', f('xPos'))
      .attr('cy', f('yPos'))
      .call(tooltip)
      .on('mouseover', function(d){
        var allNom = _.sortBy(_.filter(nominations, {name: d.name}), 'nth')
        career.attr('d', d3.svg.line().x(f('xPos')).y(f('yPos'))(allNom))
      })
    .append('title')
      .text(function(d){ return d.name + ' - ' + d.movie + ', ' + d.year })
}
