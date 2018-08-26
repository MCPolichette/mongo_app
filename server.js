// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var methodOverride = require("method-override");

// Requiring our Note and Article models
var Note = require("./models/note.js");
var Article = require("./models/article.js");

// The scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

// use body parser with the app
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// ++++++++++++++++++++++++++++++++++++++++++++
// // override with POST having ?_method=PUT
// app.use(methodOverride('_method'));
// ++++++++++++++++++++++++++++++++++++++++++++

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

// ++++++++++++++++++++++++++++++++++++++
// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on PORT" + PORT + "!");
});
