var fs = require('fs')
var nba = require('nba')
var d3 = require('d3')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('lodash')
var queue = require('queue-async')




var games = glob.sync(__dirname + '/raw-box/*.json')
  .map(function(fileStr,i){
    var res = JSON.parse(fs.readFileSync(fileStr, 'utf-8')) 
    if (res.message) return null

    var rs = res.resultSets[5].rowSet
    var rv = {}
    rv.date = rs[0][0].slice(0, 10)

    rv.hAbv = rs[0][4]
    rv.hScore = rs[0][22]
    rv.hW = +rs[0][7].split('-')[0]
    rv.hL = +rs[0][7].split('-')[1]

    rv.vAbv = rs[1][4]
    rv.vScore = rs[1][22]
    rv.vW = +rs[1][7].split('-')[0]
    rv.vL = +rs[1][7].split('-')[1]

    if (rv.hScore > rv.vScore){
      rv.hW--
      rv.vL--
    } else{
      rv.hL--
      rv.vW--
    }

    rv.tW = rv.hW + rv.hW
    rv.tL = rv.hL + rv.hL
    
    return rv
  })
  .filter(d => d)


fs.writeFileSync(__dirname + '/games.json', d3.csv.format(games))