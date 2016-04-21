var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require("glob")


var q = queue(1)

glob.sync(__dirname + "/raw/*").forEach(scrape)

function scrape(dir, i) {
  var html = fs.readFileSync(dir + '/gamelog.html', 'utf-8')
  var $ = cheerio.load(html)

  var gameDir = dir + '/games/'
  if (!fs.existsSync(gameDir)) fs.mkdirSync(gameDir)
  var downloadedGames = glob.sync(gameDir + '*.html')
  
  var count = 0

  $('#pgl_basic td a').each(function(){
    var str = $(this).text()

    if (str.length != 10) return
    count++

    var slug = $(this).attr('href').replace('/boxscores/', '')

    var url = 'http://www.basketball-reference.com/boxscores/pbp/' + slug

    q.defer(function(count, cb){
      var path = gameDir + slug.replace('.html', '') + '-' + count + '.html'
      
      if (_.contains(downloadedGames, path)) return cb()
            
      console.log(path)
      
      request(url, function(error, response, html){
        fs.writeFileSync(path, html)
        setTimeout(cb, 1000)
      })
    }, count)

  })

}

console.log('initialized queue to downloading gamelogs')