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

  var rows = html.split('all_advanced')[1].split('tbody')[1].split('<tr ').slice(1)
  rows.forEach(function(row){
    var rv = {id}

    var cols = row.split('<td ')
    cols.forEach(function(col){
      var stat = col.split('data-stat="')[1].split('"')[0].trim()
      var val  = col.split('>')[1].split('<')[0].trim() 
      if (['age', 'mp', 'ws'].includes(stat)) rv[stat] = val
      if (stat == 'season'){
        rv.season = col
          .replace('</a>', '')
          .replace('<span class="sr_star"></span>', '')
          .split('</th')[0]
          .slice(-7, -3)
      }
    })

  
    players.push(rv)

  })


  // var $ = cheerio.load(html)
  // $('#all_advanced').each(function(i){
  // // $('#all_advanced').each(function(i){
  //   var row = {id}
  //   // console.log($(this).html())
  //   console.log($(this).text())
  //   $(this).find('th, td').each(function(i){
  //     var str = $(this).text()
  //     if (i == 0){
  //       row.year = 1 + +str.split('-')[0]
  //     }
  //     if (i == 1){
  //       row.age = str
  //     }
  //     if (i == 2){
  //       row.ws = str
  //     }
  //   })

  // })
})



fs.writeFileSync(__dirname + '/players.csv', d3.csv.format(players))
// fs.writeFileSync(__dirname + '/../2017-02-02-epa-cuts/r/grants.csv', d3.csv.format(uniqRows))
