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
    d.loser  = d.homePoints < d.awayPoints ? d.home : d.away
  })

  byYear = d3.nest().key(ƒ('year')).entries(games)

  finalsTeams = []

  byYear.forEach(function(year){
    year.key = +year.key
    year.series = d3.nest()
      .key(function(d){
        return [d.home, d.away].sort() })
      .entries(year.values)

    year.series.forEach(function(d){
      d.higherSeed = d.values[0].home


      d.winner = _.last(d.values).winner
      d.loser  = _.last(d.values).loser 

      if (d.values.length < 2) return
      d.tie = d.values[0].winner == d.values[1].winner
    })

    year.firstRound = year.series.slice(0, 8)
    year.ties = d3.sum(year.firstRound, ƒ('tie'))

    year.finals = _.last(year.series)
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


  !(function(){

    finalsTeams = {}
    byYear.forEach(function(year){
      year.finals.key.split(',').forEach(function(str){
        if (!finalsTeams[str]) finalsTeams[str] = []
        finalsTeams[str].push({
          year: year.key,
          won :       str == year.finals.winner,
          higherSeed: str == year.finals.higherSeed,
          team: str
        })
      })
    })

    finalsArray = d3.entries(finalsTeams)

    var c = d3.conventions({parentSel: d3.select('#final-team')})

    c.x.domain([1950, 2015])
    c.y.domain([0, finalsArray.length])
  
    c.drawAxis()

    teams = c.svg.dataAppend(finalsArray, 'g.team')
        .translate(function(d, i){ return [0, c.y(i)] })
        
    teams.dataAppend(ƒ('value'), 'circle')
        .attr('r', 5)
        .attr('cx', ƒ('year', c.x))
        .call(d3.attachTooltip)
        .style({'fill-opacity': .4, stroke: 'black'})
  })()


  year = 2014 
  apperenceStreaks = [{teams: [], startYear: 2015, endYear: 2015}]
  byYear.reverse().forEach(function(year, i){
    if (!i) return 

    var finals = year.finals
    var winner = finals.winner
    var loser  = finals.loser 

    apperenceStreaks
      .filter(function(streak){
        return streak.endYear == year.key + 1 })
      .forEach(function(streak){
        if (_.contains(streak.teams, winner) || _.contains(streak.teams, loser)){
          year.endYear = year.key
        } else if (streak.teams.length < 4){
          finals.key.split(',').forEach(function(str){
            var newStreak = _.cloneDeep(streak)
            newStreak.endYear = year.key
            newStreak.teams.push(str)
            apperenceStreaks.push(newStreak)
          })
        }
      })


  })


})
