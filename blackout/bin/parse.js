var fs = require('fs')
var d3 = require('d3')
var ƒ = require('forte-f')
var queue = require('queue-async')
var glob = require('glob')
var request = require('request')
var _ = require('lodash')


var zips = d3.tsv.parse(fs.readFileSync(__dirname + '/zip.tsv', 'utf-8'))

glob(__dirname + "/raw-html/*.html", function (er, files) {
	files.forEach(scrape)

	fs.writeFileSync(__dirname + '/zips.json', JSON.stringify(zips, null, 2))
})

function scrape(path){
	var zipStr = path.slice(-10, -5)

	var zip = _.findWhere(zips, {zip: zipStr})

	console.log(zipStr)
	var html = fs.readFileSync(path, 'utf-8')

	if (_.contains(html, 'The U.S. zip code you entered is not within our database.')
	 || _.contains(html, 'We are unable to definitively determine your location.')	){
		zip.mlb = []
	} else {
		zip.mlb = html		
				.split('<ul style="margin:7px 0px 0px 17px;">')[1]
				.split('</ul>')[0]
				.split('<li>')
				.map(function(d){ return d.trim() })
				.filter(ƒ())
	}

	console.log(zip)
}