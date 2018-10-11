var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/Baseball_db", { useNewUrlParser: true });

// Routes

app.get("/scrape", function(req, res) {
  axios.get("http://www.mlbtraderumors.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("h2.entry-title").each(function(i, element) {
      var result = {};
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
    });

    res.send("Scrape Complete");
  });
});

app.post("/saved", function(req, res) {
  console.log(req.body)
  db.Saved.create(req.body)
  .then(function (dbSaved) {
    console.log(dbSaved)
  })
})

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
  .then(function(dbArticle){
    res.json(dbArticle);
  })
});


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
