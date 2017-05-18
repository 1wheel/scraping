var { _, d3, fs, glob, io, queue, request } = require('scrape-stl')

var headers = {
  // 'accept-encoding': 'Accepflate, sdch',
  // 'accept-language': 'he-IL,he;q=0.8,en-US;q=0.6,en;q=0.4',
  // 'cache-control': 'max-age=0',
  // connection: 'keep-alive',
  // host: 'stats.nba.com',
  referer: 'http://stats.nba.com/',
  // 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
}
var timeout = 20000
var none = {error: 'nothing'}

var q = queue(1)

var downloaded = glob.sync(__dirname + '/raw-box/*.json').map(pathToID)
var isDownloaded = {}
downloaded.forEach(d => isDownloaded[d] = true)

// d3.range(100).filter(d => d < 17 || d > 45).forEach(year =>
// // d3.range(100).filter(d => d == 15).forEach(year =>
//   d3.range(0, 410)
//   		.map(d => '004' + d3.format('02d')(year) + d3.format('05d')(d))
//   		.filter(d =>  !isDownloaded[d])
//   		.forEach(d => q.defer(downloadBox, d)) 
// )

downloadBox('0040000001')

function downloadBox(id, cb){
  var url = 'http://stats.nba.com/stats/boxscoresummaryv2?GameID=' + id
  console.log(url)

  request({url, headers, timeout}, function(err, res){
    console.log(id, err ? 'err' : '')
    console.log(err, res)
    if (cb) cb()
    var out = (!res || !res.body || res.body.length < 50) ? {error: 'nothing'} : JSON.parse(res.body)
    io.writeDataSync(__dirname + `/raw-box/${id}.json`, out)
  })
}

function pathToID(d){ return _.last(d.split('/')).replace('.json', '') }