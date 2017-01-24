// row = $$('form > table:nth-child(4) table:nth-child(5) tr')[0]


var fs = require('fs')
var d3 = require('d3')
var queue = require('queue')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')

var q = queue()

var states = ['Alabama','Hawaii','Massachusetts','New-Mexico','South-Dakota','Alaska','Idaho','Michigan','New-York','Tennessee','Arizona','Illinois','Minnesota','North-Carolina','Texas','Arkansas','Indiana','Mississippi','North-Dakota','Utah','California','Iowa','Missouri','Ohio','Vermont','Colorado','Kansas','Montana','Oklahoma','Virginia','Connecticut','Kentucky','Nebraska','Oregon','Washington','Delaware','Louisiana','Nevada','Pennsylvania','West-Virginia','Florida','Maine','New-Hampshire','Rhode-Island','Wisconsin','Georgia','Maryland','New-Jersey','South-Carolina','Wyoming','District-of-Columbia']
var shops = []

states.forEach(function(state, i){
  q.defer(function(cb){
    var url = 'http://www.findheadshops.com/' + state + '-head-shops.html'
  
    request(url, function(error, response, html){
      var $ = cheerio.load(html)
      $('tr').each(function(){
        var shop = {}
        var name = $('a', this).text()
        var location = $(this).text().replace(name, '')
        shop.state = location.slice(-2)
        shop.city = location.split(', ')[0]
        shop.name = name
        shop.link = $('a', this).attr('href')
        shops.push(shop)
      })

      cb()
    })
  })
})

q.awaitAll(function(err){
  console.log(shops)
  fs.writeFile('shops.csv', d3.csv.format(shops))
})

