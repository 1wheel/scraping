var { _, d3, fs, glob, io, queue, request } = require('scrape-stl')


// var url = 'https://twitter.com/i/profiles/show/axios/timeline/tweets?include_available_features=1&include_entities=1&max_position=POS&reset_error_state=false'
// downloadPos(886935981294858241)


var url = 'https://twitter.com/i/search/timeline?f=tweets&vertical=default&q=axios.com%20from%3Aaxios&composed_count=0&include_available_features=1&include_entities=1&include_new_items_bar=true&interval=30000&latent_count=0&min_position=POS'
downloadPos('TWEET-887046761151332352-887156565773602816-BD1UO2FFu9QAAAAAAAAETAAAAAcAAAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')

function downloadPos(pos){
  request(url.replace('POS', pos), function(err, res){
    console.log(pos, err, res.body)

    if (!res || !res.body || res.body.length < 50) return
    // var nextPos = JSON.parse(res.body).min_position

    // console.log(JSON.parse(res.body).max_position)
    var nextPos = JSON.parse(res.body).max_position
    setTimeout(() => downloadPos(JSON.parse(nextPos)), 3000)

    fs.writeFile(__dirname + `/raw/twitter/${pos}.json`, res.body, function(){})
  })
}
