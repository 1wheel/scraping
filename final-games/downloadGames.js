var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require("glob")



var games = []

glob.sync(__dirname + "/raw-series/*").forEach(scrape)

function scrape(dir, i){
  var series = dir.split('/raw-series/')[1]

  process.stdout.write("parsing " + i + " " + series + "\r")

  var html = fs.readFileSync(dir, 'utf-8')
  var $ = cheerio.load(html)

  $('a').each(function(i){
    var str = $(this).text()
    var href = $(this).attr('href')

    if (str == 'box scores' || !~href.indexOf('/boxscores/') || i % 2) return

    games.push({series: series, boxLink: $(this).attr('href').replace('/boxscores/', '')})
  })
}

fs.writeFileSync(__dirname + '/playoffGames.csv', d3.csv.format(games))



var q = queue(1)
var downloaded = glob.sync(__dirname + '/raw-box/*.html').map(d => d.split('/raw-box/')[1])

games
    .map(d => d.boxLink)
    .filter(d =>  !_.contains(downloaded, d))
    .forEach(d => q.defer(downloadBox, d)) 

function downloadBox(d, cb){
  process.stdout.write("downloading " + d + "\r");

  var url = 'http://www.basketball-reference.com/boxscores/' + d
  // console.log(url)
  setTimeout(cb, 1000)
  request(url, function(error, response, html){
    var path = __dirname + '/raw-box/' + d
    fs.writeFileSync(path, html)
  })
}