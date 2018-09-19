var Profile = require('../models/profile');
var Message = require('../models/message');

module.exports = function(req, res){
	// var from = Profile.findOne({uid: 'nGYJhshmM7UowMP6BWKLav3hcJk1'});
	// var to = Profile.findOne({uid: 'PaqrWmwMLtXfDQ4bsbj7sgdcYB63'});
	// Promise.all([
	// 	to,
	// 	from
	// ]).then(function(result){
	// 	console.log("hello");
	// 	console.log(result[0]);
	// 	console.log(result[1]);
	// 	m = new Message({
	// 		from: result[1]._id,
	// 		to: result[0]._id,
	// 		body: 'Fine',
	// 		sent_time: 1535129613,
	// 		received_time: 1535129613,
	// 		read_time: 1535129613,
	// 		deleted: false,
	// 	});
	// 	m.save(function(err){
	// 		if (err) throw err;
	// 		res.json({success: true, id: m._id});
	// 	});
	// }).catch(function(err){
	// 	res.json({error: err});
	// });

	
};
