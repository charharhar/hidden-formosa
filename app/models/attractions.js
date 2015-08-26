var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Attractions = new Schema({
	nameEnglish: String,
	nameChinese: String,
	address: String,
	category: String,
	details: String,
	cityCounty: String,
	district: String,
	lat: Number,
	long: Number

});

module.exports = mongoose.model('Attractions', Attractions);