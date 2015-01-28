var fs = require('fs')
var d3 = require('d3')
var dsv = require('dsv');
var csv = dsv(',');

var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')

var q = queue(5)

var schools = csv.parse(fs.readFileSync('schools.csv', 'utf8'))
d3.range(1999, 2014).forEach(function(year){
	schools.forEach(function(school){
		q.defer(function(cb){
			var url = 'http://www.sports-reference.com' + school.url + year
			request(url, function(error, response, html){
				console.log(school.name + ' ' + year)
				fs.writeFile('raw-html/' + school.url.split('/')[3] + '-' + year,
							html, 
							function(){})
				cb()
			})
		})
	})
})




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

