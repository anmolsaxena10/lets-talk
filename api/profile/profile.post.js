var Profile = require('../models/profile');

module.exports = function(req, res){
	var profile = new Profile({
		uid: req.body.uid,
		status: req.body.status
	});
	profile.save(function(err) {
		if (err) throw err;
		res.json({ success: true });
	});
};
