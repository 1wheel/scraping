var fs = require('fs')
var d3 = require('d3')
var glob = require('glob')
var request = require('request')
var _ = require('underscore')
var queue = require('queue-async')
var cheerio = require('cheerio')

var q = queue(1)

'abcdefghijklmnopqrstuvwxyz'.split('').forEach(d => q.defer(downloadPage, d)) 

var players = []

function downloadPage(letter, cb){
  var url = "http://www.hockey-reference.com/players/" + letter + '/'

  request(url, function(err, res){
    if (err) return console.log(err)
    var $ = cheerio.load(res.body)
    $('#div_players .nhl a').each(function(i){
      players.push($(this).attr('href'))
    })

    cb()

  })
}


q.await(function(){
  console.log(players)
  fs.writeFile(__dirname + '/names.json', JSON.stringify(players))
})


