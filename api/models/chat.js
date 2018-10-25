// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Profile = require('./profile');
var Message = require('./message');

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Chat', new Schema({
	user1: {type: Schema.Types.ObjectId, ref: 'Profile'},
	user2: {type: Schema.Types.ObjectId, ref: 'Profile'}
}));
