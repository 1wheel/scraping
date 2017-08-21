var { _, d3, fs, glob, io, queue, request } = require('scrape-stl')

var q = queue(10)
var isDownloaded  = _.indexBy(glob.sync(__dirname + '/raw/highlanderMatchDetails/*').map(pathToSlug))

glob.sync(__dirname + '/raw/leagues/*').map(io.readDataSync)
var leagues = glob.sync(__dirname + '/raw/leagues/*').map(io.readDataSync)

var matches = []

_.flatten(leagues.map(d => d.highlanderTournaments)).forEach(tournament => {
  d3.values(tournament.brackets).forEach(bracket => {
    d3.keys(bracket.matches).forEach(matchId => {
      var match = bracket.matches[matchId]

      matches.push({tournamentId: tournament.id, matchId, match})
    }) 
  })
})

var baseurl = 'http://api.lolesports.com/api/v2/highlanderMatchDetails?'


matches.forEach(d => q.defer(downloadPage, d)) 

function downloadPage({tournamentId, matchId, match}, cb){
  if (isDownloaded[matchId]) return cb()

  var url = `${baseurl}tournamentId=${tournamentId}&matchId=${matchId}`
  request(url, function(err, res){
    console.log(matchId, err)

    cb()
    if (!res || !res.body || res.body.length < 50) return

    // console.log(res.body)
    var outData = JSON.parse(res.body)
    outData.match = match

    io.writeDataSync(__dirname + `/raw/highlanderMatchDetails/${matchId}.json`, outData)
  })

}


function pathToSlug(d){
  return _.last(d.split('/')).split('.')[0]
}