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
		console.log(socket.handshake.query.user + ' connected');

		socket.on('disconnect', function () {
			console.log(socket.handshake.query.user + ' disconnected');
		});
	});
});