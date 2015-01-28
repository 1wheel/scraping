var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require("glob")


var schools = {}
var headers = ['Player', 'Class', 'Pos', 'Ht', 'Summary']
var outFile = __dirname + '/stuff.json'

scrapeSchools()

function scrapeSchools() {
	glob(__dirname + "/raw-html/*.html", function (er, files) {
		files.forEach(scrape)
		fs.writeFileSync(outFile, JSON.stringify(schools, null, 2))
	})
}


function scrape(school) {
	console.log(school)
	html = fs.readFileSync(school, 'utf-8')
	schoolName = _.last(school.split('/'))
	year = _.last(schoolName.split('-')).replace('.html', '')
	schoolName = _.initial(schoolName.split('-'))

	var $ = cheerio.load(html)

	var rows = $('#roster tr')
	
	rows.each(function() {
		var cells = []
		$('td', this).each(function(d) { cells.push($(this).text()) })
		if (!cells.length) return
		cells = _.object(headers, cells)
		schools[schoolName] = schools[schoolName] || {}
		schools[schoolName][year] = schools[schoolName][year] || []
		schools[schoolName][year].push(cells)
		// console.log(cells)
	})

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

