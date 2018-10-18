var express = require('express');

var profileRouter = require('./profile/index');
var messageRouter = require('./message/index');
var chatRouter = require('./chat/index');
var admin = require('firebase-admin');

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
				req.userId = decoded.uid;
				req.profileId = '5b800e15557a0515fabb92d7';
				next();
			}).catch(function (err) {
				return req.json(err);
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
