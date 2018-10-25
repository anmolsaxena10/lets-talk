var Message = require('../models/message');
var Profile = require('../models/profile');

module.exports = function(req, res){
	Message.find({
		'chat': req.params.id
	}).populate('to').populate('from').populate('chat').exec(function(err, messages){
		if(err) throw err;
		res.json(messages);
	});
};
