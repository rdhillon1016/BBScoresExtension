'use strict';
const url = "http://data.nba.net/10s/prod/v1/20191109/scoreboard.json";
fetch("http://data.nba.net/10s/prod/v1/20191109/scoreboard.json")
.then(response => response.text())
.then(contents => console.log(contents))
.catch(() => console.error(err));