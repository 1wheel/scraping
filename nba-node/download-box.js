var fs = require('fs')
var nba = require('nba')
var d3 = require('d3')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('lodash')
var queue = require('queue-async')

var q = queue(5)

var downloadedBox = glob.sync(__dirname + '/box/*.json').map(pathToID)

glob.sync(__dirname + '/play-by-play/*.json').map(pathToID)
    // .filter(d => !_.contains(d, downloadedBox))
    .forEach(d => q.defer(downloadBox, d))

function downloadBox(id, cb){
  console.log(id)
  nba.api.boxScoreMisc({gameId: id}, function(err, res){
    cb()
    fs.writeFile(__dirname + '/box/' + id + '.json', JSON.stringify(res), function(){})
  })
}

function pathToID(d){ return _.last(d.split('/')).replace('.json', '') }