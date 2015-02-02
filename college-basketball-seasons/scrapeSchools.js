var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require("glob")


var schoolYears = []
var headers = ['Player', 'Class', 'Pos', 'Ht', 'Summary']
var outFile = __dirname + '/stuff.json'

scrapeSchools()

function scrapeSchools() {
	glob(__dirname + "/raw-html/*.html", function (er, files) {
		files
			//.filter(function(d, i){ return i < 80 })
			.forEach(scrape)
		fs.writeFileSync(outFile, JSON.stringify(schoolYears, null, 2))
	})
}

function scrape(school) {
	console.log(school)

	var rv = {}
	
	var schoolStrs = _.last(school.split('/')).split('-')
	rv.year = schoolStrs.pop().replace('.html', '')
	rv.name = schoolStrs.join(' ')

	//if (rv.year != 2002 || rv.name != 'alabama') return
	var html = fs.readFileSync(school, 'utf-8')
	var $ = cheerio.load(html)

	rv.seed = null
	$('p').each(function(){
		var str = $(this).text()
		if (!~str.indexOf(' seed in ')){
			return
		}else{
			rv.seed = str.split('#')[1].split(' seed')[0]
		} 
	})

	rv.players = []
	var rows = $('#roster tr')
	rows.each(function() {
		var cells = []
		$('td', this).each(function(d) { cells.push($(this).text()) })
		if (!cells.length) return
		cells = _.object(headers, cells)
		rv.players.push(cells)
	})

	if (rv.players.length) schoolYears.push(rv)
}


// var schools = []
// d3.selectAll('a').each(function(){
//     var sel = d3.select(this)
//     var url = sel.attr('href')
//     if (!~url.indexOf('/cbb/schools/') || ~url.indexOf('.html') || url.length == 13) return
//     schools.push({name: sel.text(), url: sel.attr('href')})
// })

// // copy(d3.csv.format(schools))


// var shops = []

// states.forEach(function(state, i){
//   q.defer(function(cb){
//     var url = 'http://www.findheadshops.com/' + state + '-head-shops.html'
  
//     request(url, function(error, response, html){
//       var $ = cheerio.load(html)
//       $('tr').each(function(){
//         var shop = {}
//         var name = $('a', this).text()
//         var location = $(this).text().replace(name, '')
//         shop.state = location.slice(-2)
//         shop.city = location.split(', ')[0]
//         shop.name = name
//         shop.link = $('a', this).attr('href')
//         shops.push(shop)
//       })

//       cb()
//     })
//   })
// })

// q.awaitAll(function(err){
//   console.log(shops)
//   fs.writeFile('shops.csv', d3.csv.format(shops))
// })

