var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var cookieParser = require('cookie-parser');

var admin = require('firebase-admin');
var serviceAccount = require('./config/serviceAccountKey.json');

var db_config = require('./config/database'); // get our config file
var apiRouter = require('./api/index');

var redisClient = require('./lib/redis');
var socket = require('socket.io');
var redisAdapter = require('socket.io-redis');

var helper = require('./lib/functions');
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080;
mongoose.connect(db_config.mongodb, { useNewUrlParser: true }); // connect to database

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cookieParser());

// Firebase Init
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://letstalk-eda9c.firebaseio.com'
});


// use morgan to log requests to the console
app.use(morgan('dev'));

redisClient().then(function(redis){
	// =======================
	// routes ================
	// =======================
	// basic route
	app.get('/', function (req, res) {
		res.send('Hello! The API is at http://localhost:' + port + '/api');
	});

	// API ROUTES
	app.use('/api', apiRouter);

	// =======================
	// start the server ======
	// =======================
	var server = app.listen(port);
	console.log('Magic happens at http://localhost:' + port);

	var io = socket.listen(server);
	io.adapter(redisAdapter(db_config.redis));

	io.on('connection', function(socket){
		let user = JSON.parse(socket.handshake.query.user);
		console.log(user.displayName + ' connected');

		helper.addActiveUser(user);
		redis.subscribe(user.profile._id + ":channel");

		//Pass old messages which were not persisted but also not read
		helper.fetchOfflineMessages(user).then(
			msgs => {
				console.log("Offline Msgs: " + msgs[0]);
				if (msgs != undefined) {
					msgs.forEach(mess => {
						socket.emit("message", JSON.parse(mess));
					});
				}
			},
			err => {
				console.log(err);
			}
		);
		socket.emit('message', {'hello': 'hiii'});
		socket.on('message', function(data){
			helper.publishMessage(data);
			console.log("messsage");
		});

		redis.on("message", (channel, message) => {
			let chName = user.profile._id + ":channel";
			if (channel === chName) {
				socket.emit("message", JSON.parse(message));
			}
		});

		socket.on('disconnect', function () {
			helper.removeActiveUser(user);
			helper.persistMessages(user);
			console.log(user.displayName + ' disconnected');
		});
	});
});