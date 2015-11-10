var fs = require('fs')
var d3 = require('d3')
var ƒ = require('forte-f')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('underscore')


var url = 'https://primenow.amazon.com/fulfillment/availability/'

q = queue(1)

var zips  = d3.csv.parse(fs.readFileSync(__dirname + '/../zip-pop.csv', 'utf-8'))

var dlZips = glob.sync(__dirname + '/raw-zips/*').map(function(d){ return d.slice(-10, -5) })

console.log(dlZips)
// zips = zips.filter(function(d, i){ return i < 0 })

zips
	// .filter(function(d){ return !d.mlb })
	.map(ƒ('zip'))
	.filter(function(zip, i){ return !_.contains(dlZips, zip) })
	.forEach(function(zip, i){
		q.defer(function(cb){
			request(url + zip, function(error, response, html){
				if (error) return console.log(error, zip)
				console.log(i, zip, html)
				fs.writeFile(__dirname + '/raw-zips/' + zip + '.json',
							html, 
							function(){})
				cb()
			})
		})
	})