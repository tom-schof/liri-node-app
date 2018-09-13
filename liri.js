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
      name: "artistName",
      message: "Please enter the artist/band name: "
    }, ]).then(function (concertData) {

      bandsintown
        .getArtistEventList(concertData.artistName)
        .then(function (events) {
          console.log("\n");

          for (var i = 0; i < events.length; i++) {
            console.log(events[i].title);
            console.log(events[i].formatted_datetime);
            console.log(events[i].formatted_location + "\n");

          }

          // return array of events
        });


    })

  } else if (data.commands === "spotify-this-song") {
    inquirer.prompt([{
      type: "input",
      name: "spotifySong",
      message: "Please enter the song name: "
    }, ]).then(function (spotifyData) {
      spotify.search({
        type: 'track',
        query: spotifyData.spotifySong
      }, function (err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var songs = data.tracks.items;
        // console.log(data.tracks.items[0].preview_url);
        console.log("\n");
        for (var i = 0; i < 3; i++) {


          console.log(songs[i].artists[0].name + " - " + songs[i].name + " - " + songs[i].album.name + " - " + songs[i].preview_url + "\n \n \n" );
        }
      });

    })

  } else if (data.commands === "movie-this") {
    inquirer.prompt([{
      type: "input",
      name: "movie",
      message: "Please enter the movie name: "
    }, ]).then(function (movieData) {


      var movieName = movieData.movie.replace(" ", "+");

      var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
      // console.log(queryUrl);

      request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {
          console.log("Title: " + JSON.parse(body).Title);
          console.log("Release Year: " + JSON.parse(body).Year);
          console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
          console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
          console.log("Country: " + JSON.parse(body).Country);
          console.log("Plot: " + JSON.parse(body).Plot);
          console.log("Actors: " + JSON.parse(body).Actors);
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

  }

});