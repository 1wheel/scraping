var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require("glob")


var q = queue(1)

glob.sync(__dirname + "/raw-sked/*.html").forEach(scrape)


function scrape(file) {
  console.log(file)

  var html = fs.readFileSync(file, 'utf-8')
  var $ = cheerio.load(html)

  var count = 0

  $('td a').each(function(){
    var str = $(this).text()

    if ('Box Score' != str || count > 81) return
    count++

    var slug = $(this).attr('href').replace('/boxscores/', '')

    var url = 'http://www.basketball-reference.com/boxscores/pbp/' + slug

    q.defer(function(cb){
      console.log(str, count, url)
      request(url, function(error, response, html){
        fs.writeFileSync(__dirname + '/raw-games/' + slug, html)
        setTimeout(cb, 1000)
      })
    })

  })

}

