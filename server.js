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

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080;
mongoose.connect(db_config.database); // connect to database

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

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// API ROUTES
app.use('/api', apiRouter);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
