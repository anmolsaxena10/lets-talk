// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Profile', new Schema({
	uid: {type: String, index: true, unique: true},
	displayName: String,
	phoneNumber: String,
	status: String
}));
