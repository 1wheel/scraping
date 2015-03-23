var request = require('request')
var d3 = require('d3')
var queue = require('queue-async')
var fs = require('fs')

var q = queue(5)

d3.range(1951, 2016).forEach(function(year){
	q.defer(function(cb){
		var url = 'http://www.basketball-reference.com/leagues/NBA_'
		+ year + '_standings.html'
		request(url, function(error, response, html){
			console.log(year)
			fs.writeFile(__dirname + '/standingsRaw/' + year + '.html',
						html, 
						function(){})
			cb()
		})
	})
})