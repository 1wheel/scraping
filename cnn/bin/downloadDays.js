var fs = require('fs')
var d3 = require('d3')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('underscore')


var outdir = __dirname + '/../raw/days/'

var q = queue(5)
//http://transcripts.cnn.com/TRANSCRIPTS/2016.03.01.html

var url = 'http://transcripts.cnn.com/TRANSCRIPTS/'

var dateFmt = d3.time.format('%Y.%m.%d')
var firstDate = dateFmt.parse('2017.01.01')
var lastDate  = dateFmt.parse('2017.10.10')
var dateStrs = d3.time.days(firstDate, lastDate).map(dateFmt)

var dlDates = glob.sync(outdir + '*').map(function(d){
  return _.last(d.replace('.html', '').split('/')) })

console.log(firstDate)


dateStrs
  .filter(function(date, i){ return !_.contains(dlDates, date) })
  .forEach(function(date, i){
    q.defer(function(cb){
      request(url + date + '.html', function(err, response, html){
        if (err) return console.log(i, date, 'err: ', err)
        process.stdout.write(date + "\r")
        fs.writeFileSync(outdir + date + '.html', html) 
        cb()
      })
    })
  })