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

// download just lebron
// d3.range(2004, 2017).forEach(d => q.defer(downloadPage, d))
// q.awaitAll(err => console.log(err))


function downloadPage(year, cb) {
  var season = year + '-' + d3.format('02')(year - 2000 + 1)
  console.log(season)

  var url = `http://stats.nba.com/stats/playergamelogs?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=Totals&Period=0&PlayerID=2544&PlusMinus=N&Rank=N&Season=${season}&SeasonSegment=&SeasonType=Playoffs&ShotClockRange=&VsConference=&VsDivision=`

  request({ url, headers }, (err, res) => {
    if (!res || !res.body || res.body.length < 50) return
    io.writeDataSync(__dirname + `/raw-seasons/${season}.json`, JSON.parse(res.body))
    cb()
  })
}


// download all players
// http://stats.nba.com/leaders/alltime/#!?SeasonType=Playoffs&PerMode=Totals
;[893,2544,76003,977,406,1495,252,78497,2225,1449,7600].forEach(playerId => {
  d3.range(1950, 2017).forEach(d => q.defer(downloadYearPage, playerId, d))
})
q.awaitAll(err => console.log(err))

function downloadYearPage(playerId, year, cb) {
  var season = year + '-' + d3.format('02')((year % 100) + 1)
  console.log(playerId, season)

  var url = `http://stats.nba.com/stats/playergamelogs?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=Totals&Period=0&PlayerID=${playerId}&PlusMinus=N&Rank=N&Season=${season}&SeasonSegment=&SeasonType=Playoffs&ShotClockRange=&VsConference=&VsDivision=`

  request({ url, headers }, (err, res) => {
    if (!res || !res.body || res.body.length < 50) return cb()

    var data = JSON.parse(res.body)
    if (!data.resultSets[0].rowSet.length) return cb()
    io.writeDataSync(__dirname + `/raw-seasons-all/${playerId}-${season}.json`, data)
    cb()
  })
}
