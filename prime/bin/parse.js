var fs = require('fs')
var d3 = require('d3')
var ƒ = require('forte-f')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('lodash')

//view-source:http://www.amazon.com/b?node=8729023011 lol



var zips  = d3.csv.parse(fs.readFileSync(__dirname + '/../zip-pop.csv', 'utf-8'))
var sameDayZips  = fs.readFileSync(__dirname + '/sameday-zips.txt', 'utf-8').split(',')

console.log(sameDayZips.length)

zips.forEach(function(d, i){
	d.sameDay = _.contains(sameDayZips, d.zip)

	try {
		var oneDayF = fs.readFileSync(__dirname + '/raw-zips/' + d.zip + '.json', 'utf-8')
	} catch (e){

		console.log('bahhhhl', d, d.zip)
	}

	if (!oneDayF){
		d.oneHour = false
		d.twoHour = false
	} else{
		try {
			oneDayF = JSON.parse(oneDayF)
		} catch (e){
			console.log('bahhhhl', d, d.zip)
		}

		console.log(d.zip)
		d.oneHour = oneDayF.availability['one-hour'] != 'NOT_AVAILABLE'
		d.twoHour = oneDayF.availability['two-hour'] != 'NOT_AVAILABLE'
	}
})


fs.writeFileSync(__dirname + '/../prime-zips.csv', d3.csv.format(zips))