var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var bookSchema = new Schema({
    image: String,
    title: String,
    author: String,
    year: Number,
    rating: Number,
    summary: String,
    postDate: Date,
    updatedPost: {type: Boolean, default: false},
    updateDate: Date
});
module.exports = mongoose.model("Book", bookSchema);
