var { _, d3, fs, glob, io, queue, request } = require('scrape-stl')

var q = queue(1)

var matches = glob.sync(__dirname + '/raw/highlanderMatchDetails/*')
  .map(io.readDataSync)

var matchPaths = glob.sync(__dirname + '/raw/highlanderMatchDetails/*')
console.log(matchPaths[1642])

console.log(matches.length)

var isHistoryDL  = _.indexBy(glob.sync(__dirname + '/raw/matchhistory/*').map(pathToSlug))
var isTimelineDl = _.indexBy(glob.sync(__dirname + '/raw/matchtimeline/*').map(pathToSlug))

matches.forEach((match, i) => {
  // if (!match) 
  // console.log(i)
  match.gameIdMappings.forEach(({id, gameHash}) => {
    q.defer(downloadPage, {gameId: id, gameHash, match})
  })
}) 

function downloadPage({gameId, gameHash, match}, cb){
  var {gameRealm, gameId} = match.match.games[gameId]
  var baseurl = 'https://acs.leagueoflegends.com/v1/stats/game/'
  
  console.log(gameId)
  if (isTimelineDl[gameId] && isHistoryDL[gameId]) return cb()

  var url = `${baseurl}${gameRealm}/${gameId}?gameHash=${gameHash}`
  console.log(url)
  request(url, function(err, res){
    console.log(gameId, err)

    setTimeout(cb, 1000*10)
    if (!res || !res.body || res.body.length < 1000) return console.log(res.body)
    fs.writeFile(__dirname + `/raw/matchhistory/${gameId}.json`, res.body, function(){})
  })
  
  var url = `${baseurl}${gameRealm}/${gameId}/timeline?gameHash=${gameHash}`
  console.log(url)
  request(url, function(err, res){
    console.log(gameId, err)

    if (!res || !res.body || res.body.length < 1000) return
    fs.writeFile(__dirname + `/raw/matchtimeline/${gameId}.json`, res.body, function(){})
  })

}

function pathToSlug(d){
  return _.last(d.split('/')).split('.')[0]
}
