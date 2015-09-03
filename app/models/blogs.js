var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Blogs = new Schema({
	title: String,
	by: String,
	content: String,
	datePublished: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Blogs', Blogs);