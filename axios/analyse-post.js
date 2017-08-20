var { _, cheerio, d3, fs, glob, io, queue, request } = require('scrape-stl')

var posts = io.readDataSync(__dirname + '/posts.json')

var smarts = []
posts.forEach((post, i) => {
  if (i > 10000) return

  // console.log(post.body)
  post.trump = post.body.includes('Trump')
  post.beSmart = post.body.includes('<strong>Be smart')
  post.beSmarC = post.body.includes('Be smart')

  post.body.split('<p').forEach(p => {
    p.split('</p').forEach(p => {
      if (!p.includes('Be smart')) return
      post.smarts = p
    })
  })
})


console.log(
  posts.length,
  d3.sum(posts, d => d.trump),
  d3.sum(posts, d => d.beSmart),
  d3.sum(posts, d => d.beSmarC),
  d3.sum(posts, d => d.smarts ? 1 : 0),
  smarts.length
)

io.writeDataSync(__dirname + '/smarts.json', posts.filter(d => d.smarts))
console.log(smarts.slice(0, 5))
