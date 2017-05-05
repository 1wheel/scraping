var { _, d3, fs, glob, io, queue, request } = require('scrape-stl')

var headers = {
  'accept-encoding': 'Accepflate, sdch',
  'accept-language': 'he-IL,he;q=0.8,en-US;q=0.6,en;q=0.4',
  'cache-control': 'max-age=0',
  connection: 'keep-alive',
  host: 'stats.nba.com',
  referer: 'http://stats.nba.com/',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
}

var q = queue(1)

var downloadedGames = glob.sync(__dirname + '/raw-games/*')

glob
  .sync(__dirname + '/raw-seasons/*')
  .map(io.readDataSync)
  .forEach(season => {
    var { headers, rowSet } = season.resultSets[0]
    var rows = rowSet.map(row => {
      var rv = {}
      row.forEach((d, i) => (rv[headers[i]] = d))
      return rv
    })
    rows.forEach(d => q.defer(downloadGame, d))
  })

q.awaitAll(err => console.log(err))
 
function downloadGame(game, cb) {
  var url = `http://stats.nba.com/stats/boxscoretraditionalv2?EndPeriod=10&EndRange=28800&GameID=${game.GAME_ID}&RangeType=0&Season=2016-17&SeasonType=Playoffs&StartPeriod=1&StartRange=0`

  var outPath = __dirname + `/raw-games/${game.GAME_ID}.json`
  if (downloadedGames.includes(outPath)) return cb()

  request({ url, headers }, (err, res) => {
    if (!res || !res.body || res.body.length < 50) return
    io.writeDataSync(outPath, JSON.parse(res.body))
    cb()
  })
}
