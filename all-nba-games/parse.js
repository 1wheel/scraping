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
    if (res.Message) return null
    if (!res.resultSets[5].rowSet[0]) return console.log(res)

    // console.log(i)
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

    //first game of the season coded differently
    if (rv.hL < 0 || rv.vL < 0) rv.hW = rv.hL = rv.vW = rv.vL = 0

    rv.tW = rv.hW + rv.vW
    rv.tL = rv.hL + rv.vL
    
    return rv
  })
  .filter(d => d)


fs.writeFileSync(__dirname + '/games.csv', d3.csv.format(games))