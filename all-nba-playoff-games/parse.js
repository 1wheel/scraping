var { _, d3, fs, glob, io, queue, request } = require('scrape-stl')
var jp = require('d3-jetpack')

var teams = glob.sync(__dirname + '/raw-teams/*.json').map(io.readDataSync)

var games = []
teams.forEach(team => {
  team.forEach(year => {
    var isFinals = year.NBA_FINALS_APPEARANCE != 'N/A'

    if (!year.games) return

    year.games.forEach(d => {
      games.push(d)

      d.matchup = d.MATCHUP
        .replace(' @', '')
        .replace(' vs.', '')
        .split(' ')
        .sort()
        .join(' ')

      d.isFinals = isFinals
      d.year = year.YEAR
    })
  })
})

games = _.sortBy(games, 'year')
var teamYears = []

var byYear = jp.nestBy(games, d => d.year)
byYear.forEach(year => {
  var byTeam = jp.nestBy(year, d => d.Team_ID)

  byTeam.forEach(team => {
    team.year = year.key
    team.key = +team.key
    teamYears.push(team)
    team.series = jp.nestBy(team, d => d.matchup)
    // if (team.key != 1610612759) return
  })
})



// console.log(teamYears[0])

teamYears
  .filter(d => d.year == '1946-47')
  .forEach(d => console.log(d.key, d.year))

console.log(teamYears.filter(d => d.year == '1946-47')[0])

teamYears
  .filter(d => d[0].isFinals)
  .forEach(d => addrank(d, 0))

function addrank(team, rank) {
  console.log(team.key, rank)

  team.series.forEach((series, i) => {
    series.forEach(game => {
      game.rank = rank + i
    })

    if (i) {
      var matchingGames = games.filter(d => {
        return (
          d.matchup == series[0].matchup &&
          d.year == series[0].year &&
          d.Team_ID == series[0].Team_ID
        )
      })

      if (!matchingGames) return

      console.log(matchingGames[0].Team_ID, team.year)
      var matchingTeam = _.where(teamYears, {
        key: +matchingGames[0].Team_ID,
        year: team.year
      })
      // console.log(matchingTeam)

      // console.log(matchingTeam)

      addrank(matchingTeam, rank + i)

      console.log(matchingGames.length)
    }
  })
}
console.log(games[0])

// games.filter(d => d.sRank === 0).forEach(d => console.log(d))
