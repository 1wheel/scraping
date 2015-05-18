var script = document.createElement("script");
script.src = 'http://d3js.org/d3.v3.min.js';
document.body.appendChild(script);

var games = []
d3.select('tbody').selectAll('tr').each(function(d){
  var rv = {}
  var sel = d3.select(this)
  
  rv.year   = sel.select('.year').text().trim() 
  rv.round  = sel.select('.round span').text().trim()
  rv.winner = sel.select('.win span').text().trim()
  rv.loser  = sel.select('.lose span').text().trim()
  
  games.push(rv)
})

var teamYear = {}
games
  .filter(function(game){ return game.round != 'Play-In' && game.round != 'National Championship' }
  .forEach(function(game){
    [game.winner, game.loser]
      .map(function(d){ return d + '-' + game.year })
      .forEach(function(d){
        if (!teamYear[d]) teamYear[d] = 0
        teamYear[d]++
      })
  })

// var teamPoints = d3.entries(teamYear).map(function(d){
//   return {team: d.key.split('-')[0],
//           year: d.key.split('-')[1],
//           points: d.value}
// })

copy(d3.csv.format(teamPoints))