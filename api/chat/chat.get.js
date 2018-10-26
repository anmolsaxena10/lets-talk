var Chat = require('../models/chat');
var Profile = require('../models/profile');

module.exports = function(req, res){
	if(req.params[0]){
		Chat.find({
			$or: [
				{ $and: [{ 'user1': req.profile._id }, { 'user2': { $in: req.params[0].split(',')} }] },
				{ $and: [{ 'user2': req.profile._id }, { 'user1': { $in: req.params[0].split(',')} }] }
			]
		}).populate('user1').populate('user2').exec(function (err, chats) {
			if(err){
				console.log(err);
				return res.status(500).json({ error: err });
			}
			res.status(200).json(chats);
		});
	}
	else{
		Chat.find({
			$or: [{'user1': req.profile._id}, {'user2': req.profile._id}]
		}).populate('user1').populate('user2').exec(function(err, chats){
			if (err){
				console.log(err);
				return res.status(500).json({ error: err });
			}
			// console.log(chats[0].user1);
			res.json(chats);
		});
	}
};
