var fs = require('fs')
var nba = require('nba')
var d3 = require('d3')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('lodash')
var queue = require('queue-async')

var q = queue(5)

q.await(d => console.log(d))

var downloaded = glob.sync(__dirname + '/play-by-play/*.json')
		.map(d => _.last(d.split('/')).replace('.json', ''))

d3.range(1, 360)
		.map(d => '002150' + d3.format('04d')(d))
		.filter(d => !_.contains(d, downloaded))
		.forEach(d => q.defer(downloadGame, d))

function downloadGame(id, cb){
	console.log(id)
	nba.api.playByPlay({gameId: id}, function(err, res){
		cb()
		if (!res.playByPlay.length) return
		fs.writeFile(__dirname + '/play-by-play/' + id + '.json', JSON.stringify(res), function(){})
	})
}
