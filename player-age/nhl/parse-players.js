var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require('glob')



var players = []

glob.sync(__dirname + '/raw/*.html').forEach(function(path, i){
  // if (i > 2) return

  var html = fs.readFileSync(path, 'utf-8')

  var id = _.last(path.split('/')).replace('.html', '')
  console.log(id)

<<<<<<< HEAD
  var rows = html.split('all_advanced')[1].split('tbody')[1].split('<tr ').slice(1)
=======
  var miscStats = html.split('all_stats_misc_nhl')[1]
  if (!miscStats) return

  var rows = miscStats.split('tbody')[1].split('<tr ').slice(1)
>>>>>>> parses player values
  rows.forEach(function(row){
    var rv = {id}

    var cols = row.split('<td ')
    cols.forEach(function(col){
      var stat = col.split('data-stat="')[1].split('"')[0].trim()
      var val  = col.split('>')[1].split('<')[0].trim() 
<<<<<<< HEAD
      if (['age', 'mp', 'ws'].includes(stat)) rv[stat] = val
=======
      if (['age', 'mp', 'ps'].includes(stat)) rv[stat] = val
>>>>>>> parses player values
      if (stat == 'season'){
        rv.season = col
          .replace('</a>', '')
          .replace('<span class="sr_star"></span>', '')
          .split('</th')[0]
          .slice(-7, -3)
      }
    })

<<<<<<< HEAD
  
=======
>>>>>>> parses player values
    players.push(rv)

  })

})



fs.writeFileSync(__dirname + '/players.csv', d3.csv.format(players))
