var Message = require('../models/message');
var Profile = require('../models/profile');

module.exports = function(req, res){
	Message.find({
		'_id': {$in: req.params.id.split(',')}
	}).populate('Profile').exec(function(err, messages){
		if(err) throw err;
		res.json(messages);
	});
};
