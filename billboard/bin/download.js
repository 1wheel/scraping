var fs = require('fs')
var d3 = require('d3')
var ƒ = require('forte-f')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('underscore')


var q = queue(5)


var url = 'http://www.billboard.com/charts/hot-100/'

var dateFmt = d3.time.format('%Y-%m-%d')
var lastDate = dateFmt.parse('2016-01-16')
var firstDate = d3.time.saturday.offset(lastDate, -3000)
var dateStrs = d3.time.saturdays(firstDate, lastDate).map(dateFmt)

var dlDates = glob.sync(__dirname + '/../raw-html/*').map(function(d){
	return _.last(d.replace('.html', '').split('/')) })

// Todo - check for bad dates?
// var badZips = []
// dlZips = dlZips.filter(function(d){
// 	try {
// 		JSON.parse(fs.readFileSync(__dirname + '/raw-zips/' + d + '.json'))
// 		return true
// 	} catch (e){
// 		console.log(d)
// 		badZips.push(d)
// 		return false
// 	}
// })

// console.log(badZips)

dateStrs
	.filter(function(date, i){ return !_.contains(dlDates, date) })
	.forEach(function(date, i){
		// first billboard in 1958-08-09
		if (dateFmt.parse(date) < dateFmt.parse('1958-08-03')) return

		q.defer(function(cb){

			request(url + date, function(err, response, html){
				if (err) return console.log(i, date, 'err: ', err)
				console.log(i, date, 'worked')
				fs.writeFile(__dirname + '/../raw-html/' + date + '.html',
							html, 
							function(err){ if (err) console.log(err) })
				cb()
			})
		})
	})