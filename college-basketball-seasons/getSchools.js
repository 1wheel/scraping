var fs = require('fs')
var d3 = require('d3')
var queue = require('queue')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')



var schools = []
d3.selectAll('a').each(function(){
    var sel = d3.select(this)
    var url = sel.attr('href')
    if (!~url.indexOf('/cbb/schools/') || ~url.indexOf('.html') || url.length == 13) return
    schools.push({name: sel.text(), url: sel.attr('href')})
})

copy(d3.csv.format(schools))


var shops = []

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

