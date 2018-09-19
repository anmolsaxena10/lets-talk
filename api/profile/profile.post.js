var Profile = require('../models/profile');

module.exports = function(req, res){
	var profile = new Profile({
		uid: req.body.id,
		status: req.body.status
	});
	profile.save(function(err) {
		if (err) throw err;
		res.json({ success: true });
	});
};
