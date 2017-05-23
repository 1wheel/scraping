
var { _, d3, fs, glob, io, queue, request } = require('scrape-stl')
var jp = require('d3-jetpack')

// parse all games
var seasons = glob.sync(__dirname + '/raw-seasons-all/*')
  .map(io.readDataSync)
  .map(game => {
    return _.sortBy(parseResultSet(game.resultSets[0]), 'GAME_DATE')
  })

var allGames = _.flatten(seasons)


var gameID2Rank = io.readDataSync(__dirname + '/../all-nba-playoff-games/gameID2Rank.json')

// delete columns
var outGames = allGames.map(d => {
  var rv = {}

  // drop if no bot charts
  var teams = d.MATCHUP.replace(' vs. ', '-').replace(' @ ', '-').split('-').sort()
  rv.team = d.TEAM_ABBREVIATION
  rv.opn = teams.filter(e => e != d.TEAM_ABBREVIATION)[0]
  rv.home = d.MATCHUP.includes('vs')
  rv.won = d.WL == 'W'

  rv.pts = d.PTS
  rv.date = d.GAME_DATE.replace('T00:00:00','')
  rv.name = d.PLAYER_NAME

  rv.rank = gameID2Rank[d.GAME_ID]
  if (!(rv.rank + 1)) console.log(d.GAME_ID, rv)

  return rv
})


var topPlayers = _.sortBy(jp.nestBy(outGames, d => d.name), d => d3.sum(d, d => d.pts)).slice(-50)
var name2top = {}
topPlayers.forEach(d => name2top[d.key] = true)
console.log(topPlayers.map(d => d.key))
console.log(outGames.length)
outGames = outGames.filter(d => name2top[d.name])
console.log(outGames.length)


io.writeDataSync(__dirname + '/every-game.json', outGames)
io.writeDataSync(__dirname + '/../../2017-05-05-playoff-record/public/_assets/every-game.json', outGames)


function parseResultSet({ headers, rowSet }) {
  return rowSet.map(row => {
    var rv = {}
    row.forEach((d, i) => (rv[headers[i]] = d))
    return rv
  })
}



