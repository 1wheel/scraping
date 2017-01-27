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

  row.grantNumber = ''
  if (html.split('<b>EPA Grant Number:</b>')[1]){
    row.grantNumber = html.split('<b>EPA Grant Number:</b>')[1].split('<br />')[0]
  }

  row.title = ''
  if (html.split('<b>Title:</b>')[1]){
    row.title       = html.split('<b>Title:</b>')[1].split('<br /')[0]
  }

  row.categories = ''
  if (html.split('<b>Research Category:</b>')[1]){
    row.categories = html.split('<b>Research Category:</b>')[1].split('<br /')[0]
      .split('">').map(d => d.split('</')[0].trim())
      .join(', ')    
  }

  row.description = ''
  if (html.split('<h3>Description:</h3>')[1]){
    row.description = html.split('<h3>Description:</h3>')[1].split('<p></p>')[0]//.replace(g/<p>, '')
  }

  row.amount = ''
  if (html.split('<b>Project Amount:</b>')[1]){
    row.amount = html.split('<b>Project Amount:</b>')[1].split('<br />')[0]
      .replace('$','')
      .replace(',','')
      .replace(',','')
  }

  row.keywords = ''
  if (html.split('<h3>Supplemental Keywords:</h3>')[1]){
    row.keywords = html.split('<h3>Supplemental Keywords:</h3>')[1].split('<p />')[0]
  }

  row.allText = html.split('<h2>')[1].split('<div id="block-epa-og-footer"')[0]

  console.log(path)

  var date = html.split('<b>Project Period:</b>')[1].split('<br />')[0]
  if (date.split('through')[1]){
    row.start = date.split('through')[0]
    row.end   = date.split('through')[1].split('(')[0]

    if (date.split('Extended to')[1]){
      row.final = date.split('Extended to')[1].replace(')', '')
    } else{
      row.final = row.end
    }    
  } else{
    row.start = date
    row.end = row.final = ''
  }

  for (key in row){
    if (row[key].trim) row[key] = row[key].trim() 
  }

  rows.push(row)
})

// remove duplicate rows
// var uniqRows = d3.nest()
//   .key(d => d.grantNumber)
//   .entries(rows)
//   .map(d => d.values[0])


fs.writeFileSync(__dirname + '/researchGrants.json', JSON.stringify(rows))
fs.writeFileSync(__dirname + '/../../../2017-02-02-epa-cuts/r/researchGrants.json', JSON.stringify(rows))
