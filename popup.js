'use strict';

handleGamesData();

async function getGamesData(){
    let today = new Date();
    let year = today.getFullYear();
    let truemonth = today.getMonth() + 1;
    let month = (truemonth < 10 ? "" + 0 + truemonth: truemonth);
    let date = (today.getDate() < 10 ? "" + 0 + today.getDate() : today.getDate());
    let dateforurl = "" + year + month + date;
    const url = "http://data.nba.net/10s/prod/v1/"+dateforurl+"/scoreboard.json";
    let response1 = await fetch(url);
    let json1 = await response1.json();
    return json1;
}

function handleGamesData(){
    getGamesData()
    .then(contents => makeAllBoxes(contents))
    .catch(err => console.error(err));
}

function makeAllBoxes(data){ 
    console.log(data);
    let numGames = data.numGames;
    for(let i = 0; i < numGames; i++){
        let game = data.games[i];
        let boxside = 1;              // Game box will go on right side
        if (i % 2 == 0){ 
            boxside = 0;              // Game box will go on left side
        }
        let ateamname = game.vTeam.triCode;
        let hteamname = game.hTeam.triCode;
        if (game.statusNum == 1){
            makeSingleBox(boxside, -1, ateamname, -1, hteamname, game.startTimeEastern);
        } else {
            let ateamsc = game.vTeam.score;
            let hteamsc = game.hTeam.score;
            if (game.statusNum == 2){
                let timeLeft;
                if (game.period.current <= 4){
                    timeLeft = "" + game.period.current + "Q " + game.clock;
                } else {
                    timeLeft = "" + (game.period.current - 4) + "OT " + game.block;
                }
                makeSingleBox(boxside, ateamsc, ateamname, hteamsc, hteamname, timeLeft);
            } else {
                makeSingleBox(boxside, ateamsc, ateamname, hteamsc, hteamname, "FINAL");
            }
        }
    }
}

// boxside: 0 means left side
// gamestatus: FINAL, start-time of game, or time remaining in game (with quarter)
function makeSingleBox(boxside, ateamsc, ateamname, hteamsc, hteamname, gamestatus){
    
}


