loadData(function(data){
  var nominations =  _.filter(data, {award: "ACTRESS"})
  var sel = d3.select('body')
  var str = 'Actress'

  sel.append('h3', str)

  var buttons = [
    { str:  'From the Beginning',
      setx: function(){
        x.domain(d3.extent(nominations, f('nth')))
        nominations.forEach(function(d){ d.x = x(d.nth) })
      },
      sortBy: 'start'
    }, 
    { str:  'Longest Career',
      setx: function(){
        x.domain([0, d3.max(byName, f('startToEnd'))])

        byName.forEach(function(name){
          name.values.forEach(function(d){
            d.x = x(d.nth - name.values[0].nth)
          })
        })
      },
      sortBy: function(d){ return -d.startToEnd }
    }, 
  ]

  var buttonSpans = sel.append('div').selectAll('button')
      .data(buttons).enter()
    .append('span.button')
      .text(f('str'))
      .on('click', function(d){
        d.setx()

        nameGs.transition().delay(function(d){ return d.i ? d.i*20 : 0 })
          .selectAll('rect')
            .attr('x', f('x'))

        _.sortBy(byName, d.sortBy).forEach(function(d, i){
          d.oldI = d.i
          d.i = i })

        nameGs.transition().delay(function(d){ return d.oldI*10 + 2000 }).duration(650)
            .attr('transform', function(d){ return 'translate(' + [0, d.i*18] + ')' })
            // .translate(function(d, i){ return [0, d.i*18]})
        
        buttonSpans.classed('selected', function(e){ return d == e })

      })




  var byName = d3.nest().key(f('name')).entries(_.sortBy(nominations, 'nth'))
    .filter(function(d){ return d.values.length > 1 || d.values[0].won })

  byName.forEach(function(d){
    var firstWin = 0
    d.values.some(function(d, i){
      if (d.won){
        firstWin = i
        return true
      }
    })

    d.values = _.sortBy(d.values, f('nth'))

    d.start       = d.values[0].nth
    d.startToEnd  =  _.last(d.values).nth - d.values[0].nth
    d.noms        = d.values.length
    d.wins        = d.values.filter(f('won')).length
    d.firstWin    = firstWin
  })

  byName = _.sortBy(byName, function(d){ return d.values[0].nth - _.last(d.values).nth })
  
  var height = byName.length*25,
      width  = 500

  margin.left = 150

  var svg = sel.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scale.linear()
      .domain([0, d3.max(byName, function(d){ return d.values.length})])    
      .range([0, width])


  var nameGs = svg.selectAll('name')
      .data(byName).enter()
    .append('g.name')
      .translate(function(d, i){ return [0, i*18]})

  nameGs.append('text')
      .text(f('key'))
      .attr({'text-anchor': 'end', x: -10})
      .style('font-size', '10pt')

  var rects = nameGs.selectAll('rect')
      .data(f('values')).enter()
    .append('rect.oscar').classed('won', f('won'))
      .attr('x', function(d, i){ return x(i) })
      .attr({width: 10, height: 10, y: -10})

  rects.append('title').text(f('movie'))
})

