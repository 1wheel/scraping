var d3 = require('d3')
var fs = require('fs')
var glob = require('glob')
var cheerio = require('cheerio')


var outFile = __dirname + '/standings.json'
var teamYears = []

glob(__dirname + "/standingsRaw/*.html", function (er, files) {
	files.forEach(scrape)

	fs.writeFileSync(outFile, JSON.stringify(teamYears, null, 2))
})


function scrape(path){
	var year = path.slice(-9, -5)
	if (+year < 1971) return
	if (year != '2014') return

	var html = fs.readFileSync(path, 'utf-8')
	var $ = cheerio.load(html)

	var abvToTeam = {}
	$('#div_E_standings a').each(function(){
		abvToTeam[urlToId($(this).attr('href'))] = {conf: 'e'}
	})
	$('#div_W_standings a').each(function(){
		abvToTeam[urlToId($(this).attr('href'))] = {conf: 'w'} 
	})
	$('.full_table').each(function(i){
		var team = d3.values(abvToTeam)[i]
		var str = $(this).text()
		team.playoffs = !!~str.indexOf('*')
		team.seed = str.split('(')[1].split(')')[0]
	})

	var eastI, westI
	$('#div_expanded-standings .tooltip').each(function(i){
		if ($(this).text() == 'E') eastI = i
		if ($(this).text() == 'W') westI = i
	})

	$('#div_expanded-standings tr').each(function(){
		if (!$('a', this).attr('href')) return

		var abv = urlToId($('a', this).attr('href'))
		var rv = abvToTeam[abv] || {}
		rv.abv = abv

		rv.year = year
		console.log(rv)

		var cells = []
		$('td', this).each(function(d) { cells.push($(this).text()) })

		rv.tW = cells[2].split('-')[0]
		rv.tL = cells[2].split('-')[1]
		
		rv.eW = cells[eastI].split('-')[0]
		rv.eL = cells[eastI].split('-')[1]
		
		rv.wW = cells[westI].split('-')[0]
		rv.wL = cells[westI].split('-')[1]
		
		teamYears.push(rv)
	})
}

function urlToId(str){
	return str.split('/')[2]
}