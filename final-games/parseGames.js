var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require('glob')


var games = d3.csv.parse(fs.readFileSync(__dirname + '/playoffGames.csv', 'utf-8'))
var series  = d3.csv.parse(fs.readFileSync(__dirname + '/series.csv', 'utf-8'))


var a = '1996-nba-eastern-conference-semifinals-knicks-vs-bulls.html'
var b = '/playoffs/1996-nba-eastern-conference-semifinals-knicks-vs-bulls.html'
var c = '1996-nba-eastern-conference-semifinals-knicks-vs-bulls.html'


slugToRound = {}
series.forEach(function(d){
  slugToRound[d.seriesLink.replace('/playoffs/', '')] = d.round 
})

var players = []
games.forEach(scrape)
function scrape(game, i){
  var year = game.series.split('-')[0]
  var league = game.series.split('-')[1]
  var round = slugToRound[game.series]
  var gameSlug = game.boxLink.replace('.html', '')

  if (league != 'nba') return

  game.players = []

  process.stdout.write('parsing ' + i + ' ' + gameSlug + '\r')

  var html = fs.readFileSync(__dirname + '/raw-box/' + game.boxLink, 'utf-8')
  var $ = cheerio.load(html)

  $('.table_container').each(function(i){
    var str = $(this).text()
    var href = $(this).attr('href')
    var id = $(this).attr('id')

    if (~id.indexOf('four') || ~id.indexOf('advanced')) return

    var team = $(this).attr('id').split('_')[1]

    $(this).find('tbody tr').each(function(){
      var player = {league, year, round, game: game.boxLink.replace('html', ''), team}

      $(this).find('td').each(function(i){
        var str = $(this).text()
        if (i == 0) player.player = $(this).find('a').attr('href').split('/')[3].replace('.html', '')
        if (i == 19) player.pts = str
      })

      players.push(player)
    })
  })
}

fs.writeFileSync(__dirname + '/players.csv', d3.csv.format(players))

