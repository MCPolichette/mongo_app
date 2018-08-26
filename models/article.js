// Require mongoose
var mongoose = require("mongoose");

// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title requires a string
  title: {
    type: String,
    require: true
  },
  // Link requires a string
  link: {
    type: String,
    require: true
  },
  // This saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
