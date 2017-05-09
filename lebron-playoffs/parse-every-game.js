var { _, d3, fs, glob, io, queue, request } = require('scrape-stl')


// parse all games
var seasons = glob.sync(__dirname + '/raw-seasons-all/*')
  .map(io.readDataSync)
  .map(game => {
    return _.sortBy(parseResultSet(game.resultSets[0]), 'GAME_DATE')
  })

var allGames = _.flatten(seasons)

// console.log(allGames[0])

// delete columns
var outGames = allGames.map(d => {
  var rv = {}
  var teams = d.MATCHUP.replace(' vs. ', '-').replace(' @ ', '-').split('-').sort()
  rv.team = d.TEAM_ABBREVIATION
  rv.opn = teams.filter(e => e != d.TEAM_ABBREVIATION)[0]
  // rv.home = d.MATCHUP.includes('vs')

  rv.won = d.WL == 'W'
  rv.pts = d.PTS

  rv.date = d.GAME_DATE.replace('T00:00:00','')
  rv.year = d.GAME_DATE.split('-')[0]
  rv.name = d.PLAYER_NAME

  return rv
})


io.writeDataSync(__dirname + '/every-game.json', outGames)
io.writeDataSync(__dirname + '/../../2017-05-05-playoff-record/public/_assets/every-game.json', outGames)


function parseResultSet({ headers, rowSet }) {
  return rowSet.map(row => {
    var rv = {}
    row.forEach((d, i) => (rv[headers[i]] = d))
    return rv
  })
}



