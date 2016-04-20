var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require("glob")


var q = queue(1)
var subs = []
var blocks = []

glob.sync(__dirname + "/raw-games/*.html").forEach(scrape)


function scrape(file, gameIndex){
  if (gameIndex) return

  var html = fs.readFileSync(file, 'utf-8')

  var isPlayoff = ~html.indexOf('Game 1')

  var $ = cheerio.load(html)

  var count = 0
  var qtr = 1
  var tableStarted = false

  $('tr').each(function(i){
    //ignore cells until playbyplay starts
    tableStarted = tableStarted || $(this).attr('id') == 'q1'
    if (!tableStarted) return

    var str = $(this).text()

    var inLastQ = false   //was curry playing at the end of last quater?
    var inThisQ = false   //did curry play this quater?
    var isIn = false     //was curry playing last time log mentioned him?

    if (~str.indexOf('Back to Top')){
      //if curry had no events for the entire quater, sub 
      if (!inThisQ && isIn){
        subs.push({gameIndex, qtr, time: '00:00', isIn: false, str})
        isIn = false
      }

      qtr++
      inLastQ = isIn
      inThisQ = false

    }
      console.log(isIn)

    var playerI = str.indexOf('S. Curry')
    var entersI = str.indexOf('enters the game')
    if (!~playerI) return

    var time = $(this).text().split('\n')[1]

    //is this a sub log item?
    if (!~entersI){
      //insert a sub in at start of quater if curry made a play while marked out
      if (!isIn && !inLastQ){
        // if ()

        isIn = true
        subs.push({gameIndex, qtr, time: '12:00', isIn, str})
        inThisQ = true
      }

    } else{
      isIn = playerI < entersI
      subs.push({gameIndex, qtr, time, isIn, str})
      inThisQ = true
      console.log(isIn)
      
    }

  })
}

fs.writeFileSync(__dirname + '/public/subs.csv', d3.csv.format(subs))