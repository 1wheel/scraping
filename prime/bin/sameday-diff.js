var fs = require('fs')
var d3 = require('d3')
var ƒ = require('forte-f')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('underscore')

//view-source:http://www.amazon.com/b?node=8729023011 lol

var oldSameDayZips  = fs.readFileSync(__dirname + '/sameday-update.txt', 'utf-8').split(',')
var newSameDayZips  = fs.readFileSync(__dirname + '/sameday-update2.txt', 'utf-8').split(',')


var added   = []
var removed = [] 

oldSameDayZips.forEach(function(d){
  if (!_.contains(newSameDayZips, d)) removed.push(d)
})

newSameDayZips.forEach(function(d){
  if (!_.contains(oldSameDayZips, d)) added.push(d)
})

console.log(removed)
console.log(added)


fs.writeFileSync(__dirname + '/samed-added.json', JSON.stringify(added))
