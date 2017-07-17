var { _, cheerio, d3, fs, glob, io, queue, request } = require('scrape-stl')

var colNames = 'Date-P-Blue-Red-Win-RBans-BBans-RPicks-BPicks-BRoster-RRoster-Len-BG-BK-BT-BD-BB-BRH RG-RK-RT-RD-RB-RRH-ΔG-ΔK-ΔT-ΔD-ΔB-ΔRH-SB--MH-VOD'
  .split('-')

var rows = []

glob.sync(__dirname + '/raw/*.html').forEach(function(path, i){
  // if (i) return

  var slug = path.replace('.html', '').split('/').slice(-1)[0]

  var html = fs.readFileSync(path, 'utf-8')
  var $ = cheerio.load(html)

  $('table tr').each(function(rowIndex){

    var row = {gameIndex: 9999 - rowIndex, slug}
    $(this).find('td').each(function(i){
      if (!colNames[i]) return
      row[colNames[i]] = $(this)
        .text()
        .replace('\n', '')
        .trim()
    })

    if (row.Date) rows.push(row)
  })
})

io.writeDataSync(__dirname + '/out.csv', rows)

playerRows = rows.map(d => {
    return {
      gameIndex: d.gameIndex,
      slug: slug,
      Date: d.Date,
      Red: d.Red,
      Blue: d.Blue,
      Win: d.Win,
      RRoster: d.RRoster,
      BRoster: d.BRoster
    }
  })

io.writeDataSync(__dirname + '/player-rows.csv', playerRows)
