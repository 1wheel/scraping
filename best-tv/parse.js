var d3 = require('d3')
var fs = require('fs')


var reviews = []
d3.range(2010, 2017).forEach(function(year){
  var fileStr = fs.readFileSync(__dirname + '/years/' + year + '.txt', 'utf-8')
  // console.log(fileStr)

  var reviewers = fileStr.split('\n\n')
  reviewers.forEach(function(reviewer){
    var name = reviewer.split('\n')[0]
      .replace('View article','')
      .replace('View full list', '')
      .trim()

    if (name.length > 50) console.log(year, name, reviewer)

    reviewer.split('\n')[1].split(')').forEach(function(str, i){
      var show = str.split('(')[0].trim()
      var network = str.split('(')[1] 
      var rank = i + 1

      if (show && i < 10) reviews.push({year, name, show, network, rank})
    })

  })

  console.log(year, reviewers.length)
})


fs.writeFileSync(__dirname + '/reviews.csv', d3.csv.format(reviews))