var fs = require('fs')
var d3 = require('d3')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('underscore')


var shows = d3.csv.parse(fs.readFileSync(__dirname + '/games.csv', 'utf-8'))

var outdir = __dirname + '/../raw/shows/'

var q = queue(5)

var url = 'http://transcripts.cnn.com/TRANSCRIPTS/'


var oldDls = glob.sync(outdir + '*').map(function(d){
  return _.last(d.replace('.html', '').split('/')) })


dateStrs
  .filter(function(date, i){ return !_.contains(oldDls, date) })
  .forEach(function(date, i){
    q.defer(function(cb){
      request(url + date + '.html', function(err, response, html){
        if (err) return console.log(i, date, 'err: ', err)
        console.log(i, date, 'worked')
        fs.writeFileSync(outdir + date + '.html', html) 
        cb()
      })
    })
  })