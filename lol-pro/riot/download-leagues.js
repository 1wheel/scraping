var { _, d3, fs, glob, io, queue, request } = require('scrape-stl')

var q = queue(1)


var baseurl = 'http://api.lolesports.com/api/v1/leagues?slug='


'lck na-lcs lpl-china eu-lcs lms na-cs eu-cs rift-rivals msi worlds' // all-star
  .split(' ')
  .forEach(d => q.defer(downloadPage, d)) 

function downloadPage(league, cb){
  request(baseurl + league, function(err, res){
    console.log(league, err)

    cb()
    if (!res || !res.body || res.body.length < 50) return

    fs.writeFileSync(__dirname + `/raw/leagues/${league}.json`, res.body)
  })

}
