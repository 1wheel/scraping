var fs = require('fs')
var d3 = require('d3')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('underscore')
var cheerio = require('cheerio')

var {io, jp} = require('scrape-stl')

var shows = io.readDataSync(__dirname + '/../shows.csv')

glob.sync(__dirname + '/../raw/shows/*').forEach(function(fileStr, i){
  // if (i > 0) return

  var html = fs.readFileSync(fileStr, 'utf-8')
  process.stdout.write(i + ' ' + fileStr + "\r")

  var slug = fileStr.replace('.html', '').split('/').slice(-1)[0]

  var $ = cheerio.load(html)
  var text = ''


  $('.cnnBodyText').each(function(i){
    // text = text + ' ' +  $(this).text()
    text = $(this).text() // only use last body text
  })

  var m = _.findWhere(shows, {slug})
  m.text = text + ''


})


jp.nestBy(shows, d => d.date.split('.').slice(0, 2).join('-'))
  .forEach(d => {
    fs.writeFileSync(`../raw/parsed-months/${d.key}.csv`, d3.csv.format(d))
  })

// io.writeDataSync('../shows-text.csv', shows)

