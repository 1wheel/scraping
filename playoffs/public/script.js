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

var pastToPresentTeam = {
  BAL: 'WAS',
  BUF: 'LAC',
  CAP: 'WAS',
  CHH: 'NOH',
  CIN: 'SAC',
  KCK: 'SAC',
  KCO: 'SAC',
  FTW: 'DET',
  NOK: 'NOH',
  NOJ: 'UTA',
  SDC: 'LAC',
  SDR: 'HOU',
  SEA: 'OKC', 
  SFW: 'GSW',
  SYR: 'PHI',
  VAN: 'MEM', 
  WSB: 'WAS', 
}



d3.csv('playoff-games.csv', function(data){
  games = data

  games.forEach(function(d){
    if (pastToPresentTeam[d.home]) d.home = pastToPresentTeam[d.home]
    if (pastToPresentTeam[d.away]) d.away = pastToPresentTeam[d.away]

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



  threeStreaks = byYear
    .map(function(d, i){
      if (d.key == 2015) return

      var rv = calcLongestStreak(d.key, 4)
      rv.start = d.key
      rv.years = rv.start - rv.key
      return rv
    })
    .filter(ƒ())


  !(function(){
    d3.select('body').append('h1').text('Number of previous consective years w/ on of three teams in finals')
    var c = d3.conventions({parentSel: d3.select('body')})

    c.x.domain([1950, 2014])
    c.y.domain([0, d3.max(threeStreaks, ƒ('years'))])
  
    c.drawAxis()

    c.line.x(ƒ('start', c.x)).y(ƒ('years', c.y))

    c.svg.append('path.line')
        .attr('d', c.line(threeStreaks))  

  })()

  windowSize = 5
  finalsArray.forEach(function(team){
    team.prev10Finals = d3.range(1950, 2014).map(function(year){
      return {
        year: year, 
        num: team.value.filter(function(d){
          return year - windowSize < d.year && d.year <= year
        }).length
      }
    })
  })

  !(function(){
    d3.select('body').append('h1').text('Previous 10 year apperence')
    var c = d3.conventions({parentSel: d3.select('body')})

    c.x.domain([1950, 2014])
    c.y.domain([0, windowSize])
  
    c.drawAxis()

    c.line.x(ƒ('year', c.x)).y(ƒ('num', c.y))

    c.svg.dataAppend(finalsArray, 'path.line')
        .attr('d', ƒ('prev10Finals', c.line))
        .call(d3.attachTooltip)

  })()


})


function calcLongestStreak(year, num){
  var apperenceStreaks = [{teams: [], startYear: year, endYear: year}]
  byYear.slice().reverse().forEach(function(year, i){

    var finals = year.finals
    var winner = finals.winner
    var loser  = finals.loser 

    apperenceStreaks
      .filter(function(streak){
        return streak.endYear - 1 <= year.key })
      .forEach(function(streak){
        if (_.contains(streak.teams, winner) || _.contains(streak.teams, loser)){
          streak.endYear = year.key
        } else if (streak.teams.length < num){
          finals.key.split(',').forEach(function(str){
            var newStreak = JSON.parse(JSON.stringify(streak))
            newStreak.endYear = year.key
            newStreak.teams.push(str)
            newStreak.teams.sort()
            newStreak.teamStr = newStreak.teams.join(',')
            if (_.contains(apperenceStreaks.map(ƒ('teamStr')), newStreak.teamStr)) return
            apperenceStreaks.push(newStreak)
          })
        }
      })
  })



  return d3.nest().key(ƒ('endYear')).entries(apperenceStreaks)
      .sort(d3.ascendingKey('key'))[0]

}



//longest ever
// _.sortBy(apperenceStreaks.filter(function(d){ return d.endYear == 1950 }), ƒ('teams', 'length'))[2].teams
