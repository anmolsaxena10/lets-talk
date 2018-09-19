var async = require('async');

var Profile = require('../models/profile');
var admin = require("firebase-admin");

module.exports = function(req, res){
	var user = admin.auth().getUser(req.params.id);
	var profile = Profile.findOne({uid: req.params.id});

	Promise.all([
		profile,
		user
	]).then(function(results){
		user = results[1].toJSON();
		user['status'] = results[0].status;
		res.json(user);
	}).catch(function(err){
		res.json({error: err});
	});
};
