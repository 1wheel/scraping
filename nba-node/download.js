var fs = require('fs')
var d3 = require('d3')
var ƒ = require('forte-f')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('underscore')
var nba = require('nba')


;["0021500200", "0021500187", "0021500177", "0021500164", "0021500144", "0021500125", "0021500120", "0021500104", "0021500092", "0021500083", "0021500069", "0021500051", "0021500035", "0021500030", "0021500003"].forEach(function(id){
	nba.api.playByPlay({gameId: id}, function(err, res){
		fs.writeFile(__dirname + '/raw/' + id + '.json', JSON.stringify(res), function(){})
	})
})



// var url = 'https://primenow.amazon.com/fulfillment/availability/'

// q = queue(10)

// var zips  = d3.csv.parse(fs.readFileSync(__dirname + '/../zip-pop.csv', 'utf-8'))

// var dlZips = glob.sync(__dirname + '/raw-zips/*').map(function(d){ return d.slice(-10, -5) })

// // console.log(dlZips)
// // zips = zips.filter(function(d, i){ return i < 0 })

// zips
// 	// .filter(function(d){ return !d.mlb })
// 	.map(ƒ('zip'))
// 	.filter(function(zip, i){ return !_.contains(dlZips, zip) })
// 	.forEach(function(zip, i){
// 		q.defer(function(cb){
// 			request(url + zip, function(error, response, html){
// 				if (error) return console.log(error, zip)
// 				console.log(i, zip, html)
// 				fs.writeFile(__dirname + '/raw-zips/' + zip + '.json',
// 							html, 
// 							function(){})
// 				cb()
// 			})
// 		})
// 	})