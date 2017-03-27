var fs = require('fs')
var d3 = require('d3')
var glob = require('glob')
var request = require('request')
var _ = require('underscore')
var queue = require('queue-async')
  var exec = require('child_process').exec;

var q = queue(1)

d3.range(1, 116).forEach(d => q.defer(downloadPage, d)) 

// function downloadPage(year, cb){
//   var url = `http://bioguide.congress.gov/biosearch/biosearch1.asp`
//   var formData = {lastname: '', firstname: '', position: '',  state: '', party: '', year: year}

//   // request.post({url, formData}, function(err, res){
//   request.post(url, 'lastname=&firstname=&position=&state=&party=&congress=2011', function(err, res){
//     console.log(year, err)
//     // cb()
//     if (!res || !res.body || res.body.length < 50) return
//     fs.writeFile(__dirname + `/raw/${year}.html`, res.body, function(){})
//   })

// }


function downloadPage(year, cb){
  var args = `curl 'http://bioguide.congress.gov/biosearch/biosearch1.asp' -H 'Cookie: __cfduid=d7327125ca700f66d088aa4b032e889791481842798; s_pers=%20s_fid%3D3449A0D7238A964B-2ADF19BB74E7A8E8%7C1552062642612%3B; s_sess=%20s_cc%3Dtrue%3B%20s_sq%3D%3B; ASPSESSIONIDAASATATS=IIILLKIBIHLLKONAJBLBEFOJ; ASPSESSIONIDAACRTAQQ=HICBLCCDCMKAMPLCBEKAEINF' -H 'Origin: http://bioguide.congress.gov' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-US,en;q=0.8' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' -H 'Cache-Control: max-age=0' -H 'Referer: http://bioguide.congress.gov/biosearch/biosearch.asp' -H 'Connection: keep-alive' --data 'lastname=&firstname=&position=&state=&party=&congress=${year}' --compressed`

  exec('curl ' + args, function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    fs.writeFile(__dirname + `/raw/${year}.html`, stdout, function(){})

    cb()
    if (error !== null) console.log('exec error: ' + error);
  });
}