if (global.v8debug) global.v8debug.Debug.setBreakOnException()

var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require('glob')


var games    = d3.csv.parse(fs.readFileSync(__dirname + '/playoffGames.csv', 'utf-8'))
var rounds   = d3.csv.parse(fs.readFileSync(__dirname + '/series.csv', 'utf-8'))
var eloGames = d3.csv.parse(fs.readFileSync(__dirname + '/raw-elo/nbaallelo.csv', 'utf-8'))

rounds = rounds.filter(d => d.league == 'NBA')

var finalsRounds = rounds.filter(d => d.round == 'Finals')
var finalsTeams = _.flatten(finalsRounds.map(function(d){
  var year = d.year
  return [{year, team: d.winner, won: true}, {year, team: d.loser, won: false}]
}))


finalsTeams.forEach(function(team, i){
  process.stdout.write(['parsing', i, team.team, team.year, '\r'].join(' '))

  team.rounds = rounds.filter(d => 
    d.year == team.year && 
    d.round != 'Finals' && 
    d.winner == team.team)

  team.rounds.forEach(function(round){
    var seriesLink = round.seriesLink.replace('/playoffs/', '')
    round.games = games.filter(d => d.series == seriesLink)

    round.firstGameId = round.games[0].boxLink.replace('.html', '')
    var elo = eloGames.filter(d => d.game_id == round.firstGameId)[0]
      
    if (!elo){
      var month = +round.games[0].boxLink.substr(4, 2)
      var day = +round.games[0].boxLink.substr(6, 2)
      // var dateStr = [month, day, team.year].join['/']
      var dateStr = month + '/' + day + '/' + team.year

      var elo = eloGames.filter(d => d.date_game == dateStr && (d.team_id == team.team || d.opp_id == team.team))[0]
    }
    if (!elo) debugger

    if (elo.team_id == team.team){
      round.elo    = elo.elo_i
      round.eloOpp = elo.opp_elo_i
    } else{
      round.elo    = elo.opp_elo_i
      round.eloOpp = elo.elo_i
    }
  })

  team.eloOpp = d3.sum(team.rounds, d => d.eloOpp)
  team.isWest = !!~team.rounds.map(d => d.round).join('').indexOf('Western')
})



fs.writeFileSync(__dirname + '/public/finals-elo.json', JSON.stringify(finalsTeams))