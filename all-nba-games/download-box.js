var fs = require('fs')
var nba = require('nba')
var d3 = require('d3')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('lodash')
var queue = require('queue-async')

var q = queue(15)

var downloaded = glob.sync(__dirname + '/raw-box/*.json').map(pathToID)

d3.range(100).filter(d => d < 16 || d > 45).forEach(year =>
  d3.range(1, 1230)
  		.map(d => '002' + d3.format('02d')(year) + d3.format('05d')(d))
  		.filter(d =>  !_.contains(downloaded, d))
  		.forEach(d => q.defer(downloadBox, d)) 
)


function downloadBox(id, cb){
  var url = 'http://stats.nba.com/stats/boxscoresummaryv2?GameID='

  request(url + id, function(err, res){
    console.log(id, err)
    cb()
    if (!res || !res.body || res.body.length < 50) return
    fs.writeFile(__dirname + `/raw-box/${id}.json`, res.body, function(){})
  })
}

function pathToID(d){ return _.last(d.split('/')).replace('.csv', '') }