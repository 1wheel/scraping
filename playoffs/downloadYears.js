var fs = require('fs')
var d3 = require('d3')
var dsv = require('dsv');
var csv = dsv(',');

var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')

var q = queue(5)

var games = []

//http://www.basketball-reference.com/playoffs/NBA_2014_games.html
d3.range(1950, 2016).forEach(function(year){
	q.defer(function(cb){
		var url = 'http://www.basketball-reference.com/playoffs/NBA_' + year + '_games.html'
		request(url, function(error, response, html){
			console.log(year)
			var $ = cheerio.load(html)
			$('#games_playoffs tbody tr').each(function(){
				var game = {year: year}
				$('td', this).each(function(i){
					if (i == 0){
						game.date = $(this).text()
					} else if (i == 2){
						game.away = $(this).attr('csk').split('.')[0]
					} else if (i == 3){
						game.awayPoints = $(this).text()
					} else if (i == 4){
						game.home = $(this).attr('csk').split('.')[0]
					} else if (i == 5){
						game.homePoints = $(this).text()
					} else if (i == 6){
						game.ot = $(this).text()
					}
				})
				games.push(game)
			})

			cb()
		})
	})
})

q.awaitAll(function(){
	fs.writeFile(__dirname + '/playoff-games.csv', csv.format(games))
})