var express 		= require('express');
var app 			= express();
var port 			= process.env.PORT || 8080;
var mongoose		= require('mongoose');
var passport 		= require('passport');

var morgan 			= require('morgan');
var bodyParser		= require('body-parser');
var cookieParser	= require('cookie-parser');
var session 		= require('express-session');

// var configDB 		= require('./config/database.js');

// // connect to mongoDB
// mongoose.connect(configDB.url);

// // passport configuration
// require('./config/passport')(passport);

// express app configuration
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
	secret: 'hiddenformosasecret12345hiddenformosasecret',
	resave: false,
	saveUninitialized: false
}))

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// routes ====================================================
require('./app/routes')(app, passport);

app.listen(port);
console.log('Server is starting');
