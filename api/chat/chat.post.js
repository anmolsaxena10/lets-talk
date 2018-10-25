var Chat = require('../models/chat');
var Profile = require('../models/profile');

module.exports = function(req, res){
	console.log(req.body);
	Chat.findOne({
		$or: [
			{ $and: [{ 'user1': req.body.user1_id }, { 'user2': req.body.user2_id }] },
			{ $and: [{ 'user2': req.body.user1_id }, { 'user1': req.body.user2_id }] }
		]
	}).populate('user1').populate('user2').exec(function(err, result){
		if(err){
			console.log(err);
			return res.sendStatus(500).json({error: err});
		}
		console.log(result);
		if(result == null){
			console.log('here');
			var user1 = Profile.findOne({ _id: req.body.user1_id });
			var user2 = Profile.findOne({ _id: req.body.user2_id });
			Promise.all([
				user1,
				user2
			]).then(function (result) {
				var c = new Chat({
					user1: result[0],
					user2: result[1]
				});
				c.save(function (err) {
					if (err) throw err;
					res.status(200).json(c);
				});
			}).catch(function (err) {
				res.status(200).json({ error: err });
			});
		}
		else{
			res.json(result);
		}
	});

	
};
