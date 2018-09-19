var express = require('express');

var profileRouter = require('./profile/index');
var messageRouter = require('./message/index');
var chatRouter = require('./chat/index');
var admin = require('firebase-admin');

var router = express.Router();

router.use(function(req, res, next){
	var authToken = req.header('authToken');
	// admin.auth().verifyIdToken(authToken).then(function(decoded){
	// 	req.userId = decoded.uid;
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	req.profileId = '5b800e15557a0515fabb92d7';
	// 	next();
	// }).catch(function(err){
	// 	return req.json(err);
	// });
	next();
});
router.use('/profile', profileRouter);
router.use('/chat', chatRouter);
router.use('/message', messageRouter);
module.exports = router;
