var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require("glob")

var q = queue(1)

var players = d3.csv.parse(fs.readFileSync(__dirname + '/players.csv', 'utf-8'))

players.forEach(function(player){
  if (!player.slug) return
  
  //http://www.basketball-reference.com/players/c/curryst01/gamelog/2016/
  var url = 'http://www.basketball-reference.com/players/' + player.slug[0] + '/' + player.slug + '/gamelog/' + player.year

  q.defer(function(cb){
    request(url, function(error, response, html){
      var playerDir = __dirname + '/raw/' + player.year + '-' + player.slug
      if (!fs.existsSync(playerDir)) fs.mkdirSync(playerDir)
      fs.writeFileSync(playerDir + '/gamelog.html', html)
      setTimeout(cb, 1000)
    })
  })
})