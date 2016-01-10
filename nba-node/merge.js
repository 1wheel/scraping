var fs = require('fs')
var nba = require('nba')
var d3 = require('d3')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('lodash')
var queue = require('queue-async')


var periodToMin = [48,36,24,12,0,-5,-10,-15,-20]



var games = glob.sync(__dirname + '/play-by-play/*.json').map(function(fileStr,i){
  var scores = JSON.parse(fs.readFileSync(fileStr, 'utf-8')).playByPlay
      .filter(d => d.score)
      .map(d => ({
              h:   +d.score.split('-')[0],
              v:   +d.score.split('-')[1],
              min: periodToMin[d.period] 
                    + +d.pctimestring.split(':')[0] 
                    + +d.pctimestring.split(':')[1]/60
            }))
  scores.splice(0, 0, {min: 48, h: 0, v: 0})  

  var minutes = d3.nest().key(d => Math.floor(d.min)).entries(scores)
    .map(function(d){
      var last = _.last(d.values)
      return {min: +d.key, h: last.h, v: last.v} })

  minutes = _.sortBy(minutes, 'min').reverse()
  for (var i = 1; i < minutes.length; i++){
    console.log(i, minutes[i].min)
    if (minutes[i].min != minutes[i - 1].min - 1){
      minutes.push({min: minutes[i - 1].min - 1, h: minutes[i - 1].h, v: minutes[i - 1].v})
      minutes = _.sortBy(minutes, 'min').reverse()  
    }
  }

  var box = JSON.parse(fs.readFileSync(fileStr.replace('play-by-play', 'box'), 'utf-8'))


  return {
    minutes: minutes, 
    home: box.sqlTeamsMisc[0].teamAbbreviation,
    away: box.sqlTeamsMisc[1].teamAbbreviation,
    date: box.sqlTeamsMisc[0].gameDateEst.split('T')[0].replace('2015-', '').replace('-', '/')
  }
})

fs.writeFile(__dirname + '/' + 'game-scores' + '.json', JSON.stringify(games), function(){})
