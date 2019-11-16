'use strict';

handleGamesData();

async function getGamesData(){
    let today = new Date();
    let year = today.getFullYear();
    let truemonth = today.getMonth() + 1;
    let month = (truemonth < 10 ? "" + 0 + truemonth: truemonth);
    let day = (today.getDate() < 10 ? "" + 0 + today.getDate() : today.getDate());
    let dateforurl = "" + year + month + day;
    const url = "http://data.nba.net/10s/prod/v1/"+dateforurl+"/scoreboard.json";
    let response1 = await fetch(url);
    let json1 = await response1.json();
    return {data: json1, date: "" + day + "-" + month + "-" + year}
}

function handleGamesData(){
    getGamesData()
    .then(contents => makeAllBoxes(contents))
    .catch(err => console.error(err));
}

function makeAllBoxes(contents){
    let data = contents.data;
    let date = contents.date; 

    let header = document.createElement('div');
    header.setAttribute('id', 'header');
    let h1 = document.createElement('h1');
    h1.appendChild(document.createTextNode(date));
    header.appendChild(h1);
    document.body.appendChild(header); 

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
function makeSingleBox(boxside, ateamsc, ateamname, hteamsc, hteamname, gamestatus, date){
    let fullBox;
    fullBox = document.createElement('div');
    if (boxside == 0){
        fullBox.setAttribute('id', 'leftgame');
    } else {
        fullBox.setAttribute('id', 'rightgame');
    }

    let ateambox = document.createElement('div');
    let hteambox = document.createElement('div');
    let timebox = document.createElement('div');
    let anamebox = document.createElement('div');
    let hnamebox = document.createElement('div');
    

    timebox.setAttribute('id', 'time');
    timebox.appendChild(document.createTextNode(gamestatus));

    ateambox.setAttribute('id', 'ateambox');
    anamebox.setAttribute('id', 'teamname');
    anamebox.appendChild(document.createTextNode(ateamname));

    hteambox.setAttribute('id', 'hteambox');
    hnamebox.setAttribute('id', 'teamname');
    hnamebox.appendChild(document.createTextNode(hteamname));
    
    let hteamscorebox = document.createElement('div');
    let ateamscorebox = document.createElement('div');
    if(ateamsc > hteamsc){
        ateamscorebox.setAttribute('id', 'winningteamscore');
        hteamscorebox.setAttribute('id', 'teamscore');
    } else if (hteamsc > ateamsc){
        hteamscorebox.setAttribute('id', 'winningteamscore');
        ateamscorebox.setAttribute('id', 'teamscore');
    } else {
        hteamscorebox.setAttribute('id', 'teamscore');
        ateamscorebox.setAttribute('id', 'teamscore');
    }
    if (ateamsc >= 0){
        hteamscorebox.appendChild(document.createTextNode(hteamsc));
        ateamscorebox.appendChild(document.createTextNode(ateamsc));
    }

    ateambox.appendChild(anamebox); ateambox.appendChild(ateamscorebox);
    hteambox.appendChild(hnamebox); hteambox.appendChild(hteamscorebox);
    fullBox.appendChild(ateambox); fullBox.appendChild(timebox); fullBox.appendChild(hteambox);
    document.body.appendChild(fullBox);
}


