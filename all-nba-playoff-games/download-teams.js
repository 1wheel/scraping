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


function parseResultSet({ headers, rowSet }) {
  return rowSet.map(row => {
    var rv = {}
    row.forEach((d, i) => (rv[headers[i]] = d))
    return rv
  })
}



var none = {error: 'nothing'}

var q = queue(1)

var downloaded = glob.sync(__dirname + '/raw-box/*.json').map(pathToID)
var isDownloaded = {}
downloaded.forEach(d => isDownloaded[d] = true)


function downloadBox(id, cb){
  var url = 'http://stats.nba.com/stats/boxscoresummaryv2?GameID=' + id
  // console.log(url)

  request({url, headers}, function(err, res){
    // console.log(id, err ? 'err' : '')
    // console.log(err ? 'err' : 'good', res)
    var isError = (err || !res || !res.body || res.body.length < 50)
    console.log(url, isError)

    if (cb) setTimeout(cb, Math.random()*1000)
    var out = (isError) ? {error: 'nothing'} : JSON.parse(res.body)
    io.writeDataSync(__dirname + `/raw-box/${id}.json`, out)
  })
}

function pathToID(d){ return _.last(d.split('/')).replace('.json', '') }

// download team's list of playoffs
//http://stats.nba.com/stats/teamyearbyyearstats?LeagueID=00&PerMode=Totals&SeasonType=Playoffs&TeamID=1610612739


// get teams playoff games in a season
//http://stats.nba.com/stats/teamgamelog?LeagueID=00&Season=2016-17&SeasonType=Playoffs&TeamID=1610612739

// download each box score
// ...