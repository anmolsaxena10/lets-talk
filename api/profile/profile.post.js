var Profile = require('../models/profile');

module.exports = function(req, res){
	var profile = new Profile({
		uid: req.body.uid,
		phoneNumber: req.body.phoneNumber,
		displayName: req.body.displayName,
		status: req.body.status
	});
	profile.save(function(err) {
		if (err) throw err;
		res.json({ success: true });
	});
};
