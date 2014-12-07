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
        var location = $(this).text().replace(shop.name, '')
        shop.state = location.slice(-2)
        shop.city = location.split(', ')[0]
        shop.link = $('a', this).attr('href')
        shop.name = $('a', this).text()
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




// function getBoxFromGame(game, cb){
//   var url = 'http://www.basketball-reference.com/' + game.url

//   request(url, function(error, response, html){
//     if(!error){
//       var $ = cheerio.load(html);
//       game.home = game.url.slice(-8, -5)
//       game.away = $('.align_center.background_yellow a').text().replace(game.home, '').slice(0, 3)

//       game.players = []
//       ;[game.home, game.away].forEach(function(teamStr){
//         $('#' + teamStr + '_basic tbody tr')
//             .filter(function(i){ return i != 5 })
//             .each(function(){ addPlayerRow(this, teamStr) })        
//       })

//       function addPlayerRow(el, teamStr){
//         var player = {}
//         $('td', el).each(function(i){
//           player[columns[i]] = $(this).text().replace('Did Not Play', 0)
//         })
//         player.url = $('td a', el).attr('href')
//         player.team = teamStr
//         game.players.push(player)
//       }

//     }
//     cb(null)
//   })
// }