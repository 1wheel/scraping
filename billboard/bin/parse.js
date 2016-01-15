var fs = require('fs')
var d3 = require('d3')
var ƒ = require('forte-f')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('underscore')
var cheerio = require('cheerio')


var q = queue(5)


var dateFmt = d3.time.format('%Y-%m-%d')
var lastDate = dateFmt.parse('2016-01-16')
var firstDate = d3.time.saturday.offset(lastDate, -3000)
var dateStrs = d3.time.saturdays(firstDate, lastDate).map(dateFmt)
    .filter(function(date){ return dateFmt.parse(date) > dateFmt.parse('1958-08-03') })

var outData = []

glob.sync(__dirname + '/../raw-html/*').forEach(function(fileStr, i){
  var date =  _.last(fileStr.replace('.html', '').split('/')) 
  var html = fs.readFileSync(fileStr, 'utf-8')

  console.log(date)

  var $ = cheerio.load(html)
  $('.row-primary').each(function(i){
    var link = $('.row-title a', this).attr('href')
    var artist = $('.row-title h3', this).text().replace(/\t+/g, "").replace(/\n+/g, "").trim() 
    outData.push({
      date: date,
      week: dateStrs.indexOf(date),
      rank: i + 1,
      song: $('.row-title h2', this).text()  .replace(/\t+/g, "").replace(/\n+/g, "").trim(),
      artist: artist,
      artistID: link ? link.replace('http://www.billboard.com/artist/', '').split('/')[0] : ''
    })
  })

})


fs.writeFileSync(__dirname + '/../data.csv', d3.csv.format(outData))