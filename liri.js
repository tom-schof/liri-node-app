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


function SpotifyAPI(spotifyData) {
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


      console.log(songs[i].artists[0].name + " - " + songs[i].name + " - " + songs[i].album.name + " - " + songs[i].preview_url + "\n \n \n");
    }
  });
}

function bandsintownAPI(concertData) {
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
}

function omdbAPI(movieData) {

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

}

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
      default: "Judas Priest",
      message: "Please enter the artist/band name: "
    }, ]).then(function (concertData) {

      bandsintownAPI(concertData);
    })

  } else if (data.commands === "spotify-this-song") {
    inquirer.prompt([{
      type: "input",
      name: "spotifySong",
      default: "The Sign Ace of Base",
      message: "Please enter the song name: "
    }, ]).then(function (spotifyData) {

      SpotifyAPI(spotifyData);
    })

  } else if (data.commands === "movie-this") {
    inquirer.prompt([{
      type: "input",
      name: "movie",
      default: "Mr. Nobody",
      message: "Please enter the movie name: "
    }, ]).then(function (movieData) {

      omdbAPI(movieData);

    })

  } else if (data.commands === "do-what-it-says") {
    fs.readFile("./random.txt", "utf8", function (error, dataFS) {

      if (error) {
        return console.log(error);
      }

      var split = dataFS.split(",");
      
      var searchTerm = split[1]
      searchTerm = searchTerm.substring(1, searchTerm.length-1);
      // console.log(searchTerm);
      // searchTerm = substring(1, searchTerm.length - 1);
      var api = split[0];
      // console.log(api);

      if (api === "concert-this") {
        // console.log("bandsintown");
        bandsintown
        .getArtistEventList(searchTerm)
        .then(function (events) {
          console.log("\n");
    
          for (var i = 0; i < events.length; i++) {
            console.log(events[i].title);
            console.log(events[i].formatted_datetime);
            console.log(events[i].formatted_location + "\n");
    
          }
    
          // return array of events
        });

      } else if (api === "spotify-this-song") {
        // console.log("spotify");
        spotify.search({
          type: 'track',
          query: searchTerm
        }, function (err, data) {
          if (err) {
            return console.log('Error occurred: ' + err);
          }
          var songs = data.tracks.items;
          // console.log(data.tracks.items[0].preview_url);
          console.log("\n");
          for (var i = 0; i < 3; i++) {
      
      
            console.log(songs[i].artists[0].name + " - " + songs[i].name + " - " + songs[i].album.name + " - " + songs[i].preview_url + "\n \n \n");
          }
        });

      } else if (api === "movie-this") {
        // console.log("omdb");
        var movieName = searchTerm.replace(" ", "+");

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
      
      }else{
        console.log("nothing ran");
      }
    });
  }
});