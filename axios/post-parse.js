var { _, cheerio, d3, fs, glob, io, queue, request } = require('scrape-stl')

var rows = []

var posts = glob.sync(__dirname + '/raw/*.html').map((path, i) => {
  var slug = path.replace('.html', '').split('/').slice(-1)[0]

  var html = fs.readFileSync(path, 'utf-8')

  if (!html.includes('data-created_ts')) return
  console.log(i, path)

  var body = html
    .split('<div class="body clearfix is--expanded">')[1]
    .split('</div')[0]

  if (body.includes('<div class="widget__brief">')){
    var top = html
      .split('<div class="widget__brief">')[1]
      .split('<div class="widget__keep-reading-action widget__show-more">')[0]

    var bot = html
      .split('<div class="js--toggle-brief animate-keep-reading">')[1]
      .split('<div class="widget__keep-reading-action widget__show-less">')[0]

    body = top + bot
  }


  var author = html
    .split('class="author-avatar__name">')[1]
    .split('</a')[0]

  var date = html
    .split('data-created_ts="')[1]
    .split('">')[0]

  return {slug, author, date, body}

  // var $ = cheerio.load(html)

  // $('table tr').each(function(rowIndex){

  //   var row = {gameIndex: 9999 - rowIndex, slug}
  //   $(this).find('td').each(function(i){
  //     if (!colNames[i]) return
  //     row[colNames[i]] = $(this)
  //       .text()
  //       .replace('\n', '')
  //       .trim()
  //   })

  //   if (row.Date) rows.push(row)
  // })
})

io.writeDataSync(__dirname + '/posts.json', posts.filter(d => d))
