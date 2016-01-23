Games before 95 don't work

http://stats.nba.com/stats/boxscoresummaryv2?GameID=0029400001

First game 

http://stats.nba.com/game/#!/0024600001/

Team Abv

    res.resultSets[1].rowSet[0][2]
    res.resultSets[1].rowSet[1][2]

Scores

    res.resultSets[5].rowSet[0][22]
    res.resultSets[5].rowSet[1][22]

Error response

    {"Message":"An error has occurred."}

Print errors

    find -type f -exec grep -q "error has" {} \; -print

    find . -type f -size -96c

Update data

    download.js && parse.js && correct.js