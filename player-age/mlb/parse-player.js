var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require('glob')

var stats = '-season-age-team-lg-G-PA-runs_bat-runs_br-runs_dp-runs_fielding-runs_pos-runs_above-WAA-runs_replacement-runs_above-WAR-waa_win-waa_win-WAR_off-WAR_def-runs_above-Salary-pos_season-award_summary'.split('-')

var players = []
glob.sync(__dirname + '/raw/*.shtml').forEach(function(path, i){
  // if (i != 1) return

  var html = fs.readFileSync(path, 'utf-8')

  var id = _.last(path.split('/')).replace('.shtml', '')
  console.log(id)

  var miscStats = html.split('all_value_batting')[1]
  if (!miscStats) return

  var rows = miscStats.split('tbody')[1].split('<tr ').slice(1)
  rows.forEach(function(row, i){
    var rv = {id}

    var cols = row.split("<td align=")
    cols.forEach(function(col, i){
      var stat = stats[i].toLowerCase()
      var val  = col.split('>')[1].split('<')[0]
      if (['age', 'mp', 'war', 'season'].includes(stat)) rv[stat] = val
    })

    players.push(rv)

  })

})

fs.writeFileSync(__dirname + '/players.csv', d3.csv.format(players))
process.exit()