var fs = require('fs')
var nba = require('nba')
var d3 = require('d3')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('lodash')
var queue = require('queue-async')

var q = queue(5)

var downloaded = glob.sync(__dirname + '/raw-box/*.json').map(pathToID)

console.log(downloaded)

d3.range(1, 1230)
d3.range(1, 5)
		.map(d => '002140' + d3.format('04d')(d))
		.filter(d =>  !_.contains(downloaded, d))
		.forEach(d => q.defer(downloadBox, d))



function downloadBox(id, cb){
  var url = 'http://stats.nba.com/stats/boxscoresummaryv2?GameID='
  console.log('downloading', url + id)

  request(url + id, function(err, res){
    cb()
    if (!res || !res.body) return
    fs.writeFile(__dirname + `/raw-box/${id}.json`, res.body, function(){})
  })
}

function pathToID(d){ return _.last(d.split('/')).replace('.json', '') }