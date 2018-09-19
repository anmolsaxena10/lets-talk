var Chat = require('../models/chat');
var Profile = require('../models/profile');

module.exports = function(req, res){
	var user1 = Profile.findOne({uid: req.body.user1});
	var user2 = Profile.findOne({uid: req.body.user2});
	Promise.all([
		user1,
		user2
	]).then(function(result){
		var c = new Chat({
			user1: result[0],
			user2: result[1],
			messages: []
		});
		c.save(function(err){
			if (err) throw err;
			res.status(200).json(c);
		});
	}).catch(function(err){
		res.status(200).json({error: err});
	});

	
};
