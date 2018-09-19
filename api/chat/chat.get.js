var Chat = require('../models/chat');

module.exports = function(req, res){
	if(req.params[0]){
		Chat.find({
			$or: [
				{ $and: [{ 'user1': req.profileId }, { 'user2': { $in: req.params[0].split(',')} }] },
				{ $and: [{ 'user2': req.profileId }, { 'user1': { $in: req.params[0].split(',')} }] }
			]
		}).then(function (chats) {
			res.status(200).json(chats);
		}).catch(function (err) {
			console.log(err);
			res.status(500).json({ error: err });
		});
	}
	else{
		Chat.find({
			$or: [{'user1': req.profileId}, {'user2': req.profileId}]
		}).then(function(chats){
			res.status(200).json(chats);
		}).catch(function(err){
			console.log(err);
			res.status(500).json({error: err});
		});
	}
};
