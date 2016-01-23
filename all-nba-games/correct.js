var fs = require('fs')
var nba = require('nba')
var d3 = require('d3')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('lodash')
var queue = require('queue-async')



var games = d3.csv.parse(fs.readFileSync(__dirname + '/games.csv', 'utf-8'))

var bySeason = d3.nest()
    .key(d => d.season)
    .entries(games)
    .map(d => d.values)
bySeason.forEach(function(values){
  var teams = {}
  _.uniq(values.map(d => d.hAbv)).forEach(function(d){
    return teams[d] = {wins: 0, losses: 0} })

  values.forEach(function(d){
    d.hW = teams[d.hAbv].wins
    d.hL = teams[d.hAbv].losses
    d.vW = teams[d.vAbv].wins
    d.vL = teams[d.vAbv].losses

    d.tW = d.hW + d.vW
    d.tL = d.hL + d.vL

    var winner = +d.hScore > +d.vScore ? teams[d.hAbv] : teams[d.vAbv]
    var loser  = +d.hScore < +d.vScore ? teams[d.hAbv] : teams[d.vAbv]
    winner.wins++
    loser.losses++
  })
})

games.forEach(d => delete d.season)

games = _.sortBy(games, 'date')

fs.writeFileSync(__dirname + '/games-corrected.csv', d3.csv.format(games))