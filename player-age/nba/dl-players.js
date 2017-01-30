var fs = require('fs')
var d3 = require('d3')
var glob = require('glob')
var request = require('request')
var _ = require('underscore')
var queue = require('queue-async')
var cheerio = require('cheerio')

var q = queue(1)

var players = JSON.parse(fs.readFileSync('names.json'), 'utf-8')
players.forEach(d => q.defer(downloadPlayer, d)) 

function downloadPlayer(path, cb){
  var url = 'http://www.basketball-reference.com' + path
  console.log(path)


  request(url, function(err, res){
    if (err) return console.log(err, path)

    fs.writeFile(__dirname + '/raw/' + pathToId(path), res.body)
    cb()
  })
}


q.await(function(){
  console.log('done')
})


function pathToId(d){ return d.split('/')[3] }

// fs.writeFile(__dirname + `/raw/${d3.format("05")(startIndex)}.html`, res.body, function(){})