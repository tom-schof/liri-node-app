require("dotenv").config();
var fs = require("fs");
var inquirer = require("inquirer");
var request = require("request");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var bandsintown = require('bandsintown')("codingbootcamp");

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

moment().format();

inquirer.prompt([{
  type: "list",
  name: "commands",
  message: "Please select a command",
  choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"]
}, ]).then(function (data) {

  if (data.commands === "concert-this") {
    inquirer.prompt([{
      type: "input",
      name: "artist-name",
      message: "Please enter the artist/band name: "
    }, ]).then(function (concertData) {

      bandsintown
        .getArtist(concertData.artist-name)
        .then(function (events) {
          console.log(events);
          // return array of events
        });


    })

  } else if (data.commands === "spotify-this-song") {
    inquirer.prompt([{
      type: "input",
      name: "spotify-song",
      message: "Please enter the song name: "
    }, ]).then(function (spotifyData) {
      spotify.search({
        type: 'track',
        query: spotifyData.name
      }, function (err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        console.log(data);
      });

    })

  } else if (data.commands === "movie-this") {
    inquirer.prompt([{
      type: "input",
      name: "movie-name",
      message: "Please enter the movie name: "
    }, ]).then(function (movieData) {

      var nodeArgs = movieData.name;
      var movieName = "";

      for (var i = 2; i < nodeArgs.length; i++) {
        if (i > 2 && i < nodeArgs.length) {
          movieName = movieName + "+" + nodeArgs[i];
        } else {
          movieName += nodeArgs[i];
        }
      }
      var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
      console.log(queryUrl);

      request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {
          console.log("Release Year: " + JSON.parse(body).Year);
        }
      });


    })

  } else if (data.commands === "do-what-it-says") {
    fs.readFile("./random.txt", "utf8", function (error, dataFS) {

      if (error) {
        return console.log(error);
      }
      spotify.search({
        type: 'track',
        query: dataFS
      }, function (err, dataSpot) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        console.log(dataSpot);
      });

    });

  } else {
    console.log("What are you doing?");
  }

});