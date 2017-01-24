// row = $$('form > table:nth-child(4) table:nth-child(5) tr')[0]


var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require('glob')

glob.sync(__dirname + '/raw/*.html').forEach(function(path, i){

  // if (i) return
    
  var html = fs.readFileSync(path, 'utf-8')
  var $ = cheerio.load(html)
  $('form > table:nth-child(4) table:nth-child(5) tr').each(function(){
    console.log(this.text())
  })

})



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

