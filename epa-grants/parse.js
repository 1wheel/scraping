// row = $$('form > table:nth-child(4) table:nth-child(5) tr')[0]


var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require('glob')


var colNames = [
  'grantNumber',
  'region',
  'aaShip',
  'recipient',
  'title',
  'type',
  'cumAward',
  'start',
  'end',
  'specialist',
  'officer',
  'misc'
]

var rows = []

glob.sync(__dirname + '/raw/*.html').forEach(function(path, i){
  // if (i) return

  var html = fs.readFileSync(path, 'utf-8')
  var $ = cheerio.load(html)

  $('form > table:nth-child(3) table:nth-child(5) tr').each(function(i){
    if (!i) return //skip header row

    var row = {}
    $(this).find('td').each(function(i){
      row[colNames[i]] = $(this).text()
    })

    rows.push(row)
  })
})

//remove duplicate rows
var uniqRows = d3.nest()
  .key(d => d.grantNumber)
  .entries(rows)
  .map(d => d.values[0])


fs.writeFileSync(__dirname + '/grants.csv', d3.csv.format(uniqRows))
fs.writeFileSync(__dirname + '/../2017-02-02-epa-cuts/r/grants.csv', d3.csv.format(uniqRows))
