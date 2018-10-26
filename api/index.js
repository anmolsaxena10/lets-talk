var express = require('express');

var profileRouter = require('./profile/index');
var messageRouter = require('./message/index');
var chatRouter = require('./chat/index');
var admin = require('firebase-admin');

var Profile = require('./models/profile');

var router = express.Router();

router.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

	if ('OPTIONS' === req.method) {
		res.sendStatus(200);
	}
	else {
		var authToken = req.header('authorization');

		if(authToken){
			admin.auth().verifyIdToken(authToken).then(function (decoded) {
				req.user = decoded;
				Profile.findOne({ uid: decoded.uid }).then(function(result){
					req.profile = result;
					next();
				});
			}).catch(function (err) {
				return res.json(err);
			});
		}
		else{
			return res.sendStatus(401);
		}
	}
});
router.use('/profile', profileRouter);
router.use('/chat', chatRouter);
router.use('/message', messageRouter);
module.exports = router;
