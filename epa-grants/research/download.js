var fs = require('fs')
var d3 = require('d3')
var glob = require('glob')
var request = require('request')
var _ = require('underscore')
var queue = require('queue-async')

var q = queue(1)

d3.range(8114, 10799 + 1, 1).forEach(d => q.defer(downloadPage, d)) 

function downloadPage(startIndex, cb){
  var url = "https://cfpub.epa.gov/ncer_abstracts/index.cfm/fuseaction/display.abstractDetail/abstract/"

  request(url + startIndex, function(err, res){
    console.log(startIndex, err)
    cb()
    if (!res || !res.body || res.body.length < 50) return
    fs.writeFile(__dirname + `/raw/${d3.format("05")(startIndex)}.html`, res.body, function(){})
  })
}