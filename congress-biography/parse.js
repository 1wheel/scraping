// row = $$('form > table:nth-child(4) table:nth-child(5) tr')[0]


var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require('glob')


var colNames = [
  'name',
  'birth',
  'position', 
  'party',
  'state'
]

var rows = []

glob.sync(__dirname + '/raw/*.html').forEach(function(path, i){
  // if (i) return
  var congress = _.last(path.replace('.html', '').split('/'))

  var html = fs.readFileSync(path, 'utf-8')
  var $ = cheerio.load(html)

  $('center table tr').each(function(i){
    // if (!i) return //skip header row

    var row = {congress}
    $(this).find('td').each(function(i){
      if (!colNames[i]) return
      row[colNames[i]] = $(this).text().replace(/\n/g, '').trim()
    })

    rows.push(row)
  })
})

rows = rows.filter(d => d.name)
rows.forEach(function(d){
  d.death = d.birth.split('-')[1]
  d.birth = d.birth.split('-')[0]
  d.congress = +d.congress
})

rows = _.sortBy(rows, d => d.congress)

fs.writeFileSync(__dirname + '/congress-people.csv', d3.csv.format(rows))
fs.writeFileSync(__dirname + '/../../2017-03-01-state-legislative/public/_assets/congress-people.csv', d3.csv.format(rows))
