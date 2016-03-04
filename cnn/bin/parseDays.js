var fs = require('fs')
var d3 = require('d3')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('underscore')
var cheerio = require('cheerio')



var outdir = __dirname + '/../raw/days/'

var outData = []


glob.sync(outdir + '*').forEach(function(fileStr, i){
  var date =  _.last(fileStr.replace('.html', '').split('/')) 
  var html = fs.readFileSync(fileStr, 'utf-8')

  process.stdout.write(date + "\r")

  var $ = cheerio.load(html)
  $('a').each(function(i){
    var link = $(this).attr('href')


    if (!link || link.slice(-4) != 'html') return
    if (!~link.indexOf('/TRANSCRIPTS')) return
    if (~link.indexOf('index.html')) return

    if (link[0] == '/') link = 'http://transcripts.cnn.com' + link

    outData.push({
      date: date,
      link: link,
      slug: link.split('TRANSCRIPTS/')[1].replace('/','-').replace('/','-').replace('/','-').replace('/','-')
    })
  })

})


fs.writeFileSync(__dirname + '/../shows.csv', d3.csv.format(outData))
