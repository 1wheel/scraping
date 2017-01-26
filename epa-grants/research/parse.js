// row = $$('form > table:nth-child(4) table:nth-child(5) tr')[0]


var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require('glob')




var rows = []

glob.sync(__dirname + '/raw/*.html').forEach(function(path, i){

  // if (i != 122) return

  var html = fs.readFileSync(path, 'utf-8')

  if (!~html.indexOf('<b>EPA Grant Number:</b>')) return

  var row = {}
  row.index = i + 1
  row.grantNumber = html.split('<b>EPA Grant Number:</b>')[1].split('<br />')[0]
  row.title       = html.split('<b>Title:</b>')[1].split('<br /')[0]

  row.categories = html.split('<b>Research Category:</b>')[1].split('<br /')[0]
    .split('">').map(d => d.split('</')[0].trim())
    .join(', ')

  row.description = html.split('<h3>Description:</h3>')[1].split('<p></p>')[0]//.replace(g/<p>, '')
  row.keywords = html.split('<h3>Supplemental Keywords:</h3>')[1].split('<p />')[0]

  for (key in row){
    if (row[key].trim) row[key] = row[key].trim() 
  }

  console.log(row)
  rows.push(row)
})

// remove duplicate rows
// var uniqRows = d3.nest()
//   .key(d => d.grantNumber)
//   .entries(rows)
//   .map(d => d.values[0])


fs.writeFileSync(__dirname + '/researchGrants.csv', d3.csv.format(rows))
fs.writeFileSync(__dirname + '/../../2017-02-02-epa-cuts/r/researchGrants.csv', d3.csv.format(rows))
