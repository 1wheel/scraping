var script = document.createElement("script");
script.src = 'http://d3js.org/d3.v3.min.js';
document.body.appendChild(script);


var nominations = [],
    curYear,
    curAward

d3.selectAll('dl > *').each(function(){
  var sel = d3.select(this)
  if      (this.tagName == 'DT'){
    curYear = sel.text().trim()
  }
  else if (this.tagName == 'DIV'){
    curAward = sel.text().trim()
  }
  else{
    var nom = {year: curYear, award: curAward}
    var text = sel.text().trim()
    nom.won = ~text.indexOf('*')
    var nameMov = text.replace('*', '').split(' -- ')
    nom.name = nameMov[0].split('[NOTE').trim()
    nom.movie = nameMov[1] ? nameMov[1].split(' {')[0] : ''
    nominations.push(nom)
  }
})

copy(d3.csv.format(nominations))