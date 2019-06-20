// Require all npm packages needed and initialize them.
require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require('moment');
moment().format();
require('dotenv').config();
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var inquirer = require("inquirer");

inquirer.prompt([
    {
        type: "list",
        message: "What would you like to do?",
        choices: ["Search for concerts.", "Search Spotify for songs."],
        name: "selection"
    }
])
    .then(function (response) {
        switch (response.selection) {
            case "Search for concerts.":
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Which band/artist do you want to search concerts for?",
                        name: "choice"
                    }
                ])
                    .then(function (answer) {
                        concertSearch(answer.choice.trim());
                    });
                break;
            case "Search Spotify for songs.":
                inquirer.prompt([
                    {
                        type: "input",
                        message: "What is the name of the song you are searching for?",
                        name: "choice"
                    }
                ])
                    .then(function (answer) {
                        spotifySearch(answer.choice.trim());
                    });
                break;
        }
    });

function concertSearch(performer) {
    axios
        .get("https://rest.bandsintown.com/artists/" + performer + "/events?app_id=codingbootcamp")
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                console.log("====================================================================");
                console.log(response.data[i].venue.name);
                console.log(response.data[i].venue.city);
                console.log(moment(response.data[i].datetime).format('MM DD YYYY'));
                console.log("====================================================================");
            }
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

function spotifySearch(song) {
    spotify
        .search({ type: 'track', query: song, limit: 1 })
        .then(function (response) {
            console.log("====================================================================");
            console.log(response.tracks.items[0].album.artists[0].name);
            console.log(response.tracks.items[0].name);
            console.log(response.tracks.items[0].external_urls.spotify);
            console.log(response.tracks.items[0].album.name);
            console.log("====================================================================");
        })
        .catch(function (err) {
            console.log(err);
        });
}






