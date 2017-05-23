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

      if (d.Game_ID == '0040300136') d.matchup = 'MIA NOH'
      d.matchup = d.matchup.replace('PHX', 'PHO')

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
  })
})

console.log('\n')

teamYears.filter(d => d[0].isFinals).forEach(d => addrank(d, 0))

function addrank(team, rank) {
  if (rank > 3) throw 'up'
  console.log(team.year, team.key, rank)

  team.series.forEach((series, i) => {
    series.forEach(game => (game.rank = rank + i))

    if (i) {
      if (i + rank > 1 && team.year == '1953-54') return
      var matchingGames = games.filter(d => {
        return (
          d.matchup == series[0].matchup &&
          d.year == series[0].year &&
          d.Team_ID != series[0].Team_ID
        )
      })

      var matchingTeam = _.findWhere(teamYears, {
        key: +matchingGames[0].Team_ID,
        year: team.year
      })

      addrank(matchingTeam, rank + i)
    }
  })
}

teamYears
  .filter(d => d.year == '2016-17')
  .forEach(d => addrank(d, 4 - d.series.length))


var gameID2Rank = {}
games.forEach(d => (gameID2Rank[d.Game_ID] = d.rank))

'0045300911-0045300912-0045300961-0045300962-0045300961-0045300962-0045300911-0045300912'.split('-').forEach(d => gameID2Rank[d] = 3)

io.writeDataSync(__dirname + '/gameID2Rank.json', gameID2Rank)
