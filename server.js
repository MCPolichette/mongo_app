// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

// Requiring our Note and Article models
var Note = require("./models/note.js");
var Article = require("./models/article.js");

// The scraping tools
var axios = require("axios");
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

// Middleware!

// morgan logger for logging requests
app.use(logger("dev"));
// use body parser to handle form submissions
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// Making a static public folder
app.use(express.static("./public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.set("views", __dirname + "/views");
app.engine(
  "handlebars",
  exphbs({ defaultLayout: "main", layoutsDir: __dirname + "/views/layouts" })
);
app.set("view engine", "handlebars");

// Database with mongoose
mongoose.connect("mongodb://localhost/mongoscraper");
var db = mongoose.connection;
// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Routes
// ======

//GET requests to render Handlebars pages
app.get("/", function(req, res) {
  Article.find({ saved: false }, function(error, data) {
    var hbsObject = {
      article: data
    };
    console.log(hbsObject);
    res.render("index", hbsObject);
  });
});

app.get("/saved", function(req, res) {
  Article.find({ saved: true })
    .populate("notes")
    .exec(function(error, articles) {
      var hbsObject = {
        article: articles
      };
      res.render("saved", hbsObject);
    });
});

// A GET request to scrape the sltrib
app.get("/scrape", function(req, res) {
  // First, grab the body of the html with request
  request("https://www.sltrib.com/", function(error, response, html) {
    // Then, load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, grab every "trib-semi" within an article tag, and do the following:
    $('<div class ="headline normal-style x-small">').each(function(
      i,
      element
    ) {
      // Save an empty result object
      var result = {};

      // Add the title and summary of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();

      result.link = $(this)
        .children("a")
        .attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });
    });
    res.send("Scrape Complete");
  });
  // Tell the browser that we finished scraping the text
});

// ++++++++++++++++++++++++++++++++++++++
// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on PORT" + PORT + "!");
});
