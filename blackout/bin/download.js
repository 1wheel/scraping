var fs = require('fs')
var d3 = require('d3')
var ƒ = require('forte-f')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')


var url = 'http://www.mlb.com/mlb/subscriptions/blackout.jsp?postalCode='

q = queue(5)

var zips  = d3.tsv.parse(fs.readFileSync(__dirname + '/zip.tsv', 'utf-8'))

zips
	.filter(function(d){ return !d.mlb })
	.map(ƒ('zip'))
	.forEach(function(zip){
		q.defer(function(cb){
			request(url + zip, function(error, response, html){
				if (error) return console.log(error, zip)
				fs.writeFile(__dirname + '/raw-html/' + zip + '.html',
							html, 
							function(){})
				cb()
				console.log(zip)
			})
		})
	})