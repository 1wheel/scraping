var fs = require('fs')
var d3 = require('d3')
var glob = require('glob')
var request = require('request')
var _ = require('underscore')
var queue = require('queue-async')

var q = queue(1)

d3.range(1900, 2100, 10).forEach(d => q.defer(downloadPage, d)) 


function downloadPage(year, cb){
  var url = `https://www.ssa.gov/oact/NOTES/as120/LifeTables_Tbl_6_${year}.html`

  console.log(url)
  request(url, function(err, res){
    console.log(year, err)
    cb()
    if (!res || !res.body || res.body.length < 50) return
    fs.writeFile(__dirname + `/raw/${year}.html`, res.body, function(){})
  })

}