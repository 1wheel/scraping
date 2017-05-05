var { _, d3, fs, glob, io, queue, request } = require('scrape-stl')

var seasons = glob.sync(__dirname + '/raw-seasons/*').map(io.readDataSync).map(game => {
  return parseResultSet(game.resultSets[0])
})

var metaGames = _.flatten(seasons)

var games = glob.sync(__dirname + '/raw-games/*').map(io.readDataSync).map(game => {
  var players = parseResultSet(_.findWhere(game.resultSets, { name: 'PlayerStats' }))
  var meta = _.findWhere(metaGames, {GAME_ID: game.parameters.GameID})
  return { players, meta  }
})


io.writeDataSync(__dirname + '/games.json', games)
io.writeDataSync(__dirname + '/../../2017-05-05-playoff-record/public/_assets/games.json', games)

// parse all games
var seasons = glob.sync(__dirname + '/raw-seasons-all/*').map(io.readDataSync).map(game => {
  return parseResultSet(game.resultSets[0])
})

var allGames = _.flatten(seasons)
io.writeDataSync(__dirname + '/allGames.json', allGames)
io.writeDataSync(__dirname + '/../../2017-05-05-playoff-record/public/_assets/allGames.json', allGames)






function parseResultSet({ headers, rowSet }) {
  return rowSet.map(row => {
    var rv = {}
    row.forEach((d, i) => (rv[headers[i]] = d))
    return rv
  })
}



