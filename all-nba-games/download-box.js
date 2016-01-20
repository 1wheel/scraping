var fs = require('fs')
var nba = require('nba')
var d3 = require('d3')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('lodash')
var queue = require('queue-async')

var q = queue(5)

var downloaded = glob.sync(__dirname + '/box/*.json').map(pathToID)

d3.range(1, 2)
		.map(d => '002960' + d3.format('04d')(d))
		// .filter(d => !_.contains(d, downloaded))
		.forEach(d => q.defer(downloadBox, d))


function downloadBox(id, cb){
  console.log(id)
  nba.api.boxScoreMisc({gameId: id}, function(err, res){
    cb()
    fs.writeFile(__dirname + '/box/' + id + '.json', JSON.stringify(res), function(){})
  })
}

function pathToID(d){ return _.last(d.split('/')).replace('.json', '') }