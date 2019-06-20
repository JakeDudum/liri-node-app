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
var fs = require("fs");

inquirer.prompt([
    {
        type: "list",
        message: "What would you like to do?",
        choices: ["Search for concerts.", "Search Spotify for songs.", "Search for movies.", "Surprise me."],
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
                        makeASCII("Concert Venues");
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
                        makeASCII("Top Search Result");
                        spotifySearch(answer.choice.trim());
                    });
                break;
            case "Search for movies.":
                inquirer.prompt([
                    {
                        type: "input",
                        message: "What is the name of the movie you are searching for?",
                        name: "choice"
                    }
                ])
                    .then(function (answer) {
                        movieSearch(answer.choice.trim());
                    });
                break;
            case "Surprise me.":
                makeASCII("Is this what you wanted?")
                surprise();
                break;
        }
    });

function concertSearch(performer) {
    axios
        .get("https://rest.bandsintown.com/artists/" + performer + "/events?app_id=codingbootcamp")
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                console.log("=======================================================================================");
                console.log("Venue Name: " + response.data[i].venue.name);
                console.log("City: " + response.data[i].venue.city);
                console.log("Date(MM/DD/YYYY): " + moment(response.data[i].datetime).format('MM DD YYYY'));
                console.log("=======================================================================================");
            }
        })
        .catch(function (error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
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
            console.log("=======================================================================================");
            console.log("Artist/Band: " + response.tracks.items[0].album.artists[0].name);
            console.log("Song: " + response.tracks.items[0].name);
            console.log("Album: " + response.tracks.items[0].album.name);
            console.log("Spotify Song Link: " + response.tracks.items[0].external_urls.spotify);
            console.log("=======================================================================================");
        })
        .catch(function (err) {
            console.log(err);
        });
}

function movieSearch(movie) {
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            makeASCII(response.data.Title);
            console.log("=======================================================================================");
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("=======================================================================================");
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

function surprise() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        spotifySearch(dataArr[1]);
    });
}

function makeASCII(text) {
    axios
        .get("http://artii.herokuapp.com/make?text=" + text + "&font=slant")
        .then(function (response) {
            console.log("***************************************************************************************");
            console.log(response.data);
            console.log("***************************************************************************************");
        })
        .catch(function (error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}






