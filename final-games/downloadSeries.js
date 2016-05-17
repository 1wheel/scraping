var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require("glob")
var queue = require('queue-async')


var html = fs.readFileSync(__dirname + '/raw-playoffs/index.html', 'utf-8')

var $ = cheerio.load(html)

var series = []

$('tr').each(function(i){

  var str = $(this).text()

  var rv = {}

  $(this).find('a').each(function(i){
    var str = $(this).text()
    var href = $(this).attr('href')

    if (i == 0) rv.year = str
    if (i == 1) rv.league = str
    if (i == 2){ rv.round = str; rv.seriesLink = href }
    if (i == 3) rv.winner = href.split('teams/')[1].split('/')[0]
    if (i == 4) rv.loser  = href.split('teams/')[1].split('/')[0]  
  })
  series.push(rv)
})

series = series.filter(d => d && d.seriesLink)
fs.writeFileSync(__dirname + '/series.csv', d3.csv.format(series))


var q = queue(1)
series.forEach(function(d){
  var url = 'http://www.basketball-reference.com' + d.seriesLink

  q.defer(function(cb){
    request(url, function(error, response, html){
      var path = __dirname + '/raw-series/' + d.seriesLink.replace('/playoffs/', '')
      fs.writeFileSync(path, html)
      setTimeout(cb, 1000)
    })
  })
})