var idToObjects = {}
var globalData

function loadData(cb){
  d3.csv('data.csv', function(data){
    globalData = data
    data.forEach(function(d){
      var str = d.year.split('(')[1].split(')')[0]
      d.nth = +str.slice(0, str.length - 2)

      d.won = d.won == 'true' ? true : false


      d.award = d.award.replace(' IN A LEADING ROLE', '')
      if (d.award == 'DIRECTING'){
        var tmp = d.movie
        d.movie = d.name.trim()
        d.name = tmp.trim()
      }

      d.id = d.award + '-' + d.name

      if (!idToObjects[d.id]) idToObjects[d.id] = []
      d.prevNominations = idToObjects[d.id].slice()
      d.numPrev = d.prevNominations.length
      idToObjects[d.id].push(d)
    })

    cb(data)
  })
}


var margin = {top: 40, right: 20, bottom: 40, left: 20},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


function f(str){ return function(obj){ return str ? obj[str] : obj }}



function tooltip(selection){
  selection.on('click', function(d){ console.log(d) })
}