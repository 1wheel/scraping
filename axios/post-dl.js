var { _, d3, jp, fs, glob, io, queue, request } = require('scrape-stl')

var headers = {
  'accept-encoding': 'Accepflate, sdch',
  'accept-language': 'he-IL,he;q=0.8,en-US;q=0.6,en;q=0.4',
  'cache-control': 'max-age=0',
  connection: 'keep-alive',
  // host: 'stats.nba.com',
  referer: 'http://axios.com/',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
}

var downloadedPosts = glob.sync(__dirname + '/raw/*')

var tweets = io
  .readDataSync(__dirname + '/axios-tweets.json')
  .map(d => d.entities.urls.map(d => d.expanded_url.split('?')[0]))

var byId = jp.nestBy(_.flatten(tweets), d => d.split('-').slice(-1)[0])
byId = _.sortBy(byId, d => -d.length)
var urls = byId.map(d => d[0]).filter(d => d && d.includes('www.axios.com'))

// var urls = ['https://www.axios.com/us-syria-airstrikes-updates-trump-putin-2349024437.html']

var q = queue(10)
urls.forEach(url => q.defer(downloadPost, url))
q.awaitAll(err => console.log(err))

function downloadPost(url, cb) {
  var slug = url.split('/').slice(-1)[0]
  console.log(slug)

  var outPath = __dirname + `/raw/${slug}`
  if (downloadedPosts.includes(outPath) || !slug) return cb()

  request({ url, headers }, (err, res) => {
    if (!res || !res.body || res.body.length < 50) return console.log(err)
    io.writeDataSync(outPath, res.body)
    cb()
  })
}
