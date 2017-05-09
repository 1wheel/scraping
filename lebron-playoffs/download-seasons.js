var players = [
  "893",
  "2544",
  "76003",
  "977",
  "406",
  "1495",
  "252",
  "78497",
  "2225",
  "1449",
  "2548",
  "76970",
  "165",
  "77142",
  "1717",
  "937",
  "76127",
  "76375",
  "1450",
  "1718",
  "77141",
  "76681",
  "1460",
  "397",
  "17",
  "1938",
  "77196",
  "787",
  "305",
  "121",
  "951",
  "201142",
  "78049",
  "708",
  "1888",
  "1497",
  "2",
  "304",
  "739",
  "78318",
  "77847",
  "764",
  "201566",
  "76979",
  "56",
  "965",
  "947",
  "204",
  "77449",
  "959",
  "76988",
  "467",
  "134",
  "600003",
  "2200",
  "76500",
  "109",
  "78549",
  "76750",
  "78435",
  "600015",
  "76385",
  "270",
  "76017",
  "78076",
  "76882",
  "64",
  "76912",
  "600013",
  "345",
  "78532",
  "2207",
  "201935",
  "247",
  "2730",
  "76016",
  "1891",
  "78510",
  "77498",
  "2546",
  "76462",
  "600012",
  "201939",
  "187",
  "1472",
  "76673",
  "208",
  "101108",
  "2419",
  "1713",
  "76804",
  "76444",
  "77700",
  "76504",
  "760",
  "891",
  "76107",
  "22",
  "76545",
  "714",
  "431",
  "1890",
  "185",
  "77626",
  "600006",
  "124",
  "2210",
  "78149",
  "2405",
  "361",
  "77193",
  "76832",
  "1453",
  "894",
  "78126",
  "2030",
  "105",
  "96",
  "1122",
  "2430",
  "1885",
  "77070",
  "2547",
  "77167",
  "101114",
  "202695",
  "202691",
  "200765",
  "76539",
  "978",
  "317",
  "77929",
  "100263",
  "77340",
  "120",
  "78500",
  "77907",
  "1710",
  "920",
  "358",
  "77074",
  "297",
  "78392",
  "78351",
  "600005",
  "2561",
  "202331",
  "84",
  "76233",
  "275",
  "433",
  "76272",
  "77554",
  "1740",
  "2747",
  "76056",
  "349",
  "76253",
  "1897",
  "365",
  "698",
  "2738",
  "77160",
  "77420",
  "200794",
  "2216",
  "78060",
  "77593",
  "78331",
  "76397",
  "78151",
  "979",
  "200746",
  "251",
  "77487",
  "201586",
  "201143",
  "76176",
  "1503",
  "76362",
  "2564",
  "157",
  "78404",
  "76386",
  "201588",
  "77662",
  "23",
  "77412",
  "76011",
  "201933",
  "76133",
  "77685",
  "2746",
  "389",
  "2045",
  "765",
  "935",
  "224",
  "89",
  "78530"
]



var { _, d3, fs, glob, io, queue, request } = require('scrape-stl')

var headers = {
  'accept-encoding': 'Accepflate, sdch',
  'accept-language': 'he-IL,he;q=0.8,en-US;q=0.6,en;q=0.4',
  'cache-control': 'max-age=0',
  connection: 'keep-alive',
  host: 'stats.nba.com',
  referer: 'http://stats.nba.com/',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
}

var q = queue(1)

// download just lebron
// d3.range(2004, 2017).forEach(d => q.defer(downloadPage, d))
// q.awaitAll(err => console.log(err))


function downloadPage(year, cb) {
  var season = year + '-' + d3.format('02')(year - 2000 + 1)
  console.log(season)

  var url = `http://stats.nba.com/stats/playergamelogs?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=Totals&Period=0&PlayerID=2544&PlusMinus=N&Rank=N&Season=${season}&SeasonSegment=&SeasonType=Playoffs&ShotClockRange=&VsConference=&VsDivision=`

  request({ url, headers }, (err, res) => {
    if (!res || !res.body || res.body.length < 50) return
    io.writeDataSync(__dirname + `/raw-seasons/${season}.json`, JSON.parse(res.body))
    cb()
  })
}


// download all players
// http://stats.nba.com/leaders/alltime/#!?SeasonType=Playoffs&PerMode=Totals

// var my_awesome_script = document.createElement('script');
// my_awesome_script.setAttribute('src','https://d3js.org/d3.v4.min.js');
// document.head.appendChild(my_awesome_script);

// var urls = []
// d3.selectAll('.nba-stat-table__overlay .ng-scope .player a').each(function(d){ urls.push(this.href.split('#!/')[1].split('/')[0]) })



players
  // .slice(50)
  .forEach(playerId => {
    // d3.range(1948, 2017).forEach(d => q.defer(downloadYearPage, playerId, d))
    // ;[1999].forEach(d => q.defer(downloadYearPage, playerId, d))
  })
// q.awaitAll(err => console.log(err))

function downloadYearPage(playerId, year, queueCB) {
  function cb(){ setTimeout(queueCB, 250) }

  var season = year + '-' + d3.format('02')((year % 100) + 1).replace('100', '00')
  console.log(playerId, season)

  var url = `http://stats.nba.com/stats/playergamelogs?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=Totals&Period=0&PlayerID=${playerId}&PlusMinus=N&Rank=N&Season=${season}&SeasonSegment=&SeasonType=Playoffs&ShotClockRange=&VsConference=&VsDivision=`

  request({ url, headers }, (err, res) => {
    if (err) return console.log(err) && cb()
    if (!res || !res.body || res.body.length < 50) return cb()

    var data = JSON.parse(res.body)
    if (!data.resultSets[0].rowSet.length) return cb()
    io.writeDataSync(__dirname + `/raw-seasons-all/${playerId}-${season}.json`, data)
    cb()
  })
}



players
  .slice(50)
  .forEach(playerId => {
    q.defer(downloadPlayer, playerId)
  })
q.awaitAll(err => console.log(err))

function downloadPlayer(playerId, queueCB) {
  function cb(){ setTimeout(queueCB, 250) }

  var url = `http://stats.nba.com/stats/commonplayerinfo?LeagueID=00&PlayerID=${playerId}`

  request({ url, headers }, (err, res) => {
    if (err) return console.log(err) && cb()
    if (!res || !res.body || res.body.length < 50) return cb()

    var data = JSON.parse(res.body)
    if (!data.resultSets[0].rowSet.length) return cb()
    io.writeDataSync(__dirname + `/raw-players/${playerId}.json`, data)
    cb()
  })
}






