var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require("glob")


var q = queue(1)
var subs = []

glob.sync(__dirname + "/raw-games/*.html").forEach(scrape)


function scrape(file, gameIndex){
  var html = fs.readFileSync(file, 'utf-8')

  var isPlayoff = ~html.indexOf('Game 1')

  var $ = cheerio.load(html)

  var count = 0
  var qtr = 1

  $('tr').each(function(){
    var str = $(this).text()

    if ( ~str.indexOf('Back to Top')) qtr++

    var playerI = str.indexOf('S. Curry')
    var entersI = str.indexOf('enters the game')
    if (!~entersI || !~playerI) return
    // $(this.parent).text().split('\n')[1]
    
    var time = $(this).text().split('\n')[1]
    var slug = _.last(file.split('/')).replace('.html', '')
    var isIn = playerI < entersI
    console.log(gameIndex, qtr, time)
    subs.push({gameIndex, qtr, time, isIn, str})
  })
}

fs.writeFileSync(__dirname + '/public/subs.csv', d3.csv.format(subs))