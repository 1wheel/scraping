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

d3.range(1, 1231)
		.map(d => '002140' + d3.format('04d')(d))
		.filter(d =>  !_.contains(downloaded, d))
		.forEach(d => q.defer(downloadBox, d))



function pathToID(d){ return _.last(d.split('/')).replace('.json', '') }


var rs = res.resultSets[5].rowSet
var rv = {}
rv.date = rs[0][0].slice(0, 10)

rv.hAbv = rs[0][4]
rv.hScore = rs[0][22]
rv.hW = +rs[0][7].split('-')[0]
rv.hL = +rs[0][7].split('-')[1]

rv.vAbv = rs[1][4]
rv.vScore = rs[1][22]
rv.vW = +rs[1][7].split('-')[0]
rv.vL = +rs[1][7].split('-')[1]

if (rv.hScore > rv.vScore){
  rv.hW--
  rv.vL--
} else{
  rv.hL--
  rv.vW--
}

rv.tW = rv.hW + rv.hW
rv.tL = rv.hL + rv.hL