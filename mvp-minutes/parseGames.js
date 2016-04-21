var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')
var glob = require("glob")

var q = queue(1)
var subs = []

var players = d3.csv.parse(fs.readFileSync(__dirname + '/players.csv', 'utf-8'))

players.forEach(function(player){
  if (!player.slug) return
  var playerDir = __dirname + '/raw/' + player.year + '-' + player.slug
  
  player.subs = []
  glob.sync(playerDir + '/games/*.html').forEach(function(d, i){
    parseLog(d, i, player.subs, player.fullName[0] + '. ' + _.last(player.fullName.split(' ')), player.slug)
  })
  console.log(player.slug, player.year, player.subs.length)
})

fs.writeFileSync(__dirname + '/public/players.json', JSON.stringify(players))
console.log('wrote out players.json')

function parseLog(file, gameIndex, subs, abvName, slugName){
  var html = fs.readFileSync(file, 'utf-8')

  var isPlayoff = ~html.indexOf('Game 1')

  var $ = cheerio.load(html)

  var count = 0
  var qtr = 1
  var tableStarted = false

  var inLastQ = false   //was curry playing at the end of last quater?
  var inThisQ = false   //did curry play this quater?
  var isIn = false      //was curry playing last time log mentioned him?

  $('tr').each(function(i){
    //ignore cells until playbyplay starts
    tableStarted = tableStarted || $(this).attr('id') == 'q1'
    if (!tableStarted) return

    var str = $(this).text()

    //every quater but the first
    if (~str.indexOf('Back to Top')){
      //if curry had no events for the entire quater, sub out
      if (!inThisQ && isIn){
        subs.push({gameIndex, qtr, time: '00:00', isIn: false, str})
        isIn = false
      }

      qtr++
      inLastQ = isIn
      inThisQ = false
    }

    var playerI = str.indexOf(abvName)
    var entersI = str.indexOf('enters the game')

    var isCurryLink = false
    $(this).find('a').each(function(){
      isCurryLink = isCurryLink || ~$(this).attr('href').indexOf(slugName) })
    
    // if (~playerI && !isCurryLink) debugger 
    if (!~playerI || !isCurryLink) return
    
    var time = $(this).text().split('\n')[1]
    
    
    //is this a sub log item?
    if (!~entersI){
      //insert a sub in at start of quater if curry made a play while marked out
      if (!isIn && !inLastQ){
        isIn = true
        subs.push({gameIndex, qtr, time: '12:00', isIn, str})
        inThisQ = true
      }

    } else{
      //insert sub out at start of quater if curry subs in while marked in
      if (isIn && playerI < entersI){
        subs.push({gameIndex, qtr, time: '12:00', isIn: false, str})
      }

      isIn = playerI < entersI
      subs.push({gameIndex, qtr, time, isIn, str})
      inThisQ = true
    }

  })

  //insert sub out if curry in at game end 
  if (isIn) subs.push({gameIndex, qtr, time: '00:00', isIn: false, str: 'game end'})
}