var fs = require('fs')
var d3 = require('d3')
var glob = require('glob')
var request = require('request')
var _ = require('underscore')
var queue = require('queue-async')

var q = queue(1)


var startIndex = 1 


d3.range(1, 34000, 400).forEach(d => q.defer(downloadPage, d)) 


function downloadPage(startIndex, cb){
  var url = "https://yosemite.epa.gov/oarm/igms_egf.nsf/AllGrantsWide!OpenView&Start="

  request(url + startIndex, function(err, res){
    console.log(startIndex, err)
    cb()
    if (!res || !res.body || res.body.length < 50) return
    fs.writeFile(__dirname + `/raw/${startIndex}.html`, res.body, function(){})
  })
}