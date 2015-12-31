var fs = require('fs')
var nba = require('nba')
var d3 = require('d3')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('lodash')
var queue = require('queue-async')

var q = queue(5)


//Download playbyplay
var downloaded = glob.sync(__dirname + '/play-by-play/*.json').map(pathToID)

d3.range(1, 500)
		.map(d => '002150' + d3.format('04d')(d))
		.filter(d => !_.contains(d, downloaded))
		.forEach(d => q.defer(downloadPlayByPlay, d))

function downloadPlayByPlay(id, cb){
	nba.api.playByPlay({gameId: id}, function(err, res){
		cb()
		if (!res || !res.playByPlay.length) return
		downloaded.push(downloaded)
		fs.writeFile(__dirname + '/play-by-play/' + id + '.json', JSON.stringify(res), function(){})
	})
}


function pathToID(d){ return _.last(d.split('/')).replace('.json', '') }