var { _, d3, fs, glob, io, queue, request } = require('scrape-stl')
var nba = require('./nba-util.js')


var q = queue(1)
// nba.teams.forEach(d => q.defer(downloadTeam, d.TeamID))
nba.prevTeams.forEach(d => q.defer(downloadTeam, d.TeamID))
q.awaitAll(err => console.log(err, 'Team Queue Done'))

function downloadTeam(team, cb){
  var url = `http://stats.nba.com/stats/teamyearbyyearstats?LeagueID=00&PerMode=Totals&SeasonType=Playoffs&TeamID=${team}`

  console.log(team)
  request({url, headers: nba.headers}, (err, res) => {
    var years = nba.parseResultSet(JSON.parse(res.body).resultSets[0])

    var q = queue(1)
    years
      .filter(d => d.PO_WINS != 0 || d.PO_LOSSES != 0)
      .forEach(d => q.defer(downloadYear, d))

    q.awaitAll(err => {
      if (err) throw err
      
      io.writeDataSync(__dirname + '/raw-teams/' + team + '.json', years)
      cb()
    })
  })

  function downloadYear(year, cb){
    console.log(year.YEAR)
    var url = `http://stats.nba.com/stats/teamgamelog?LeagueID=00&Season=${year.YEAR}&SeasonType=Playoffs&TeamID=${team}`

    request({url, headers: nba.headers}, (err, res) => {
      if (err) throw err

      year.games = nba.parseResultSet(JSON.parse(res.body).resultSets[0])
      setTimeout(cb, 1000)
    })

  }
}


// download team's list of playoffs
//http://stats.nba.com/stats/teamyearbyyearstats?LeagueID=00&PerMode=Totals&SeasonType=Playoffs&TeamID=1610612739


// get teams playoff games in a season
//http://stats.nba.com/stats/teamgamelog?LeagueID=00&Season=2016-17&SeasonType=Playoffs&TeamID=1610612739

// download each box score
// ...


// var downloaded = glob.sync(__dirname + '/raw-box/*.json').map(pathToID)
// var isDownloaded = {}
// downloaded.forEach(d => isDownloaded[d] = true)


// function downloadBox(id, cb){
//   var url = 'http://stats.nba.com/stats/boxscoresummaryv2?GameID=' + id
//   // console.log(url)

//   request({url, headers}, function(err, res){
//     var isError = (err || !res || !res.body || res.body.length < 50)
//     console.log(url, isError)

//     if (cb) setTimeout(cb, Math.random()*1000)
//     var out = (isError) ? {error: 'nothing'} : JSON.parse(res.body)
//     io.writeDataSync(__dirname + `/raw-box/${id}.json`, out)
//   })
// }

// function pathToID(d){ return _.last(d.split('/')).replace('.json', '') }

