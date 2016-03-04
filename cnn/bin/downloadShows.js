var fs = require('fs')
var d3 = require('d3')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('underscore')


var shows = d3.csv.parse(fs.readFileSync(__dirname + '/../shows.csv', 'utf-8'))

var outdir = __dirname + '/../raw/shows/'

var q = queue(20)

var url = 'http://transcripts.cnn.com/TRANSCRIPTS/'


var oldDls = glob.sync(outdir + '*').map(function(d){
  return _.last(d.replace('.html', '').split('/')) })
isOldDl = {}
oldDls.forEach(function(d){ isOldDl[d] = true })

shows
  .filter(function(d, i){ return !isOldDl[d.slug] })
  .forEach(function(d, i){
    q.defer(function(cb){
      request(d.link, function(err, response, html){
        cb()
        if (err) return console.log(i, d.slug, 'err: ', err)

        process.stdout.write(i + ' ' + d.link + "\r")
        fs.writeFileSync(outdir + d.slug + '.html', html) 
      })
    })
  })