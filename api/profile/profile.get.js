var Profile = require('../models/profile');
var admin = require('firebase-admin');

module.exports = function(req, res){
	var user, profile;
	if (req.params.type==='uid'){
		user = admin.auth().getUser(req.params.id);
		profile = Profile.findOne({uid: req.params.id});
	}
	else{
		user = admin.auth().getUserByPhoneNumber(req.params.id);
		profile = Profile.findOne({ phoneNumber: req.params.id });
	}
	Promise.all([
		profile,
		user
	]).then(function(results){
		user = results[1].toJSON();
		user['profile'] = results[0];
		res.json(user);
	}).catch(function(err){
		res.status(500).json({error: err});
	});
};
