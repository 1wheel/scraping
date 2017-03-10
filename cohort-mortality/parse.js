// row = $$('form > table:nth-child(4) table:nth-child(5) tr')[0]


var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require('glob')


var colNames = [
  'age',
  'mQx',
]
colNames[6] = 'mEx'
colNames[8] = 'fQx'
colNames[14] = 'fEx'

var rows = []

glob.sync(__dirname + '/raw/*.html').forEach(function(path, i){
  var year = path.replace('.html', '').slice(-4)

  var html = fs.readFileSync(path, 'utf-8')
  var $ = cheerio.load(html)

  $('#wp1004907table999968 tr').each(function(i){
    // if (!i) return //skip header row

    var row = {year}
    $(this).find('td').each(function(i){
      if (!colNames[i]) return
      row[colNames[i]] = $(this).text().replace(/\n/g, '').trim()
    })

    rows.push(row)
  })
})

rows = rows.filter(d => d.age)

fs.writeFileSync(__dirname + '/period.csv', d3.csv.format(rows))
fs.writeFileSync(__dirname + '/../../2017-03-10-life-expectancy/public/_assets/period.csv', d3.csv.format(rows))
