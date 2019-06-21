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

function askUser() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Search for concerts.", "Search Spotify for songs.", "Search for movies.", "Surprise me.", "Leave"],
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
                            console.log("");
                            setTimeout(function () { concertSearch(answer.choice.trim()) }, 500);

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
                            makeASCII("Top Search Results");
                            console.log("");
                            setTimeout(function () { spotifySearch(answer.choice.trim()) }, 500);
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
                    makeASCII("Is this what you wanted?");
                    setTimeout(surprise, 500);
                    break;
                case "Leave":
                    makeASCII("Goodbye");
                    break;
            }
        });
}

function concertSearch(performer) {
    if (performer === "") {
        performer = "Nickelback"
    }
    axios
        .get("https://rest.bandsintown.com/artists/" + performer + "/events?app_id=codingbootcamp")
        .then(function (response) {
            console.log("\n------------------------------" + response.data[0].lineup[0] + "------------------------------\n")
            for (var i = 0; i < response.data.length; i++) {
                console.log("=======================================================================================\n");
                console.log("Venue Name: " + response.data[i].venue.name);
                console.log("City: " + response.data[i].venue.city);
                console.log("Date(MM/DD/YYYY): " + moment(response.data[i].datetime).format('MM DD YYYY'));
                console.log("\n=======================================================================================\n");
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
    setTimeout(askUser, 1500);
}

function spotifySearch(song) {
    if (song === "") {
        song = "The Sign";
    }
    spotify
        .search({ type: 'track', query: song, limit: 3 })
        .then(function (response) {
            for (var i = 0; i < 3; i++) {
                console.log("=======================================================================================\n");
                console.log("Artist/Band: " + response.tracks.items[i].album.artists[0].name);
                console.log("Song: " + response.tracks.items[i].name);
                console.log("Album: " + response.tracks.items[i].album.name);
                console.log("Spotify Song Link: " + response.tracks.items[i].external_urls.spotify);
                console.log("\n=======================================================================================\n");
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    setTimeout(askUser, 1500);
}

function movieSearch(movie) {
    if (movie === "") {
        movie = "Mr. Nobody";
    }
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            makeASCII(response.data.Title);
            setTimeout(function () {
                console.log("\n=======================================================================================\n");
                console.log("Title: " + response.data.Title);
                console.log("Year: " + response.data.Year);
                console.log("IMDB Rating: " + response.data.imdbRating);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                console.log("Country(s): " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
                console.log("\n=======================================================================================\n");
            }, 1000);
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
    setTimeout(askUser, 2500);
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

askUser();






