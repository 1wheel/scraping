var { _, d3, fs, glob, io, queue, request } = require('scrape-stl')


// parse all games
var players = glob.sync(__dirname + '/raw-players/*')
  .map(io.readDataSync)
  .map(d => parseResultSet(d.resultSets[0]))

io.writeDataSync(__dirname + '/players.json', players)
io.writeDataSync(__dirname + '/../../2017-05-05-playoff-record/public/_assets/players.json', players)


function parseResultSet({ headers, rowSet }) {
  return rowSet.map(row => {
    var rv = {}
    row.forEach((d, i) => (rv[headers[i]] = d))
    return rv
  })
}



