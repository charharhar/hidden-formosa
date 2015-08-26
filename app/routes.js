// models
var express 		= require('express');
var User 			= require('./models/user');
var Attractions 	= require('./models/attractions');

module.exports = function(app, passport) {


// Declaring seperate routes before the catch-all so they get first dibs at handling the incoming requests
// =====================================
	// declaring instance of express.Router for projects and users
	var attractionsRouter 	= express.Router();
	var userRouter 			= express.Router();

	// registering attractions and users routes
	app.use('/users', userRouter);
	app.use('/attractions', attractionsRouter);

// HOME PAGE (with login links) ========
// =====================================
	app.get('/partial/:viewname', function(req, res) {
		res.render(req.params.viewname, {user: req.user });
	})

	app.get('/*', function(req, res) {
		res.render('index', {user: req.user });
	})

// SIGNUP ==============================
// =====================================
	app.get('/signup', function(req, res) {
		res.render('signup');
	})

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup'
	}))

// LOGIN ===============================
// =====================================
	app.get('/login', function(req, res) {
		res.render('login');
	})

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login'
	}))

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	})

// USER CRUD ROUTES =========================
// ==========================================
	userRouter.get('/', function(req, res) {
		User.find(function(err, users) {
			if (!err) res.json(users);
		})
	})

	userRouter.post('/', function(req, res) {
		var newUser 		= new User();
		newUser.email 		= req.body.email;
		newUser.password 	= req.body.password;

		newUser.save(function(err, user) {
			if (!err) res.json(user)
		})
	})

	userRouter.get('/:userId', function(req, res) {
		User.findById(req.params.userId, function(err, user) {
			if (!err) res.json(user);
		})
	})

	// userRouter.put('/:userId', function(req, res) {
	// 	User.findById(req.params.userId, function(err, user) {
	// 		if (err) res.send(err);

	// 		if (req.body.email) user.email 			= req.body.email;
	// 		if (req.body.password) user.password  	= req.body.password;

	// 		user.save(function(err, user) {
	// 			if (!err) res.send(user);
	// 		})
	// 	})
	// })

	// userRouter.delete('/:userId', function(req, res) {
	// 	User.remove({ _id: req.params.userId }, function(err, user) {
	// 		if (err) return res.send(err);

	// 		res.json({ message: 'Successfully deleted user' });
	// 	})
	// })

// attractions CRUD ROUTES =====================
// ==========================================
	
	attractionsRouter.get('/', function(req, res) {
		Attractions.find(function(err, attractions) {
			if (!err) res.send(attractions);
		})
	})

	// attractionsRouter.post('/', function(req, res) {
	// 	var newAttraction 			= new Attractions();
	// 	newAttraction.nameEnglish 	= req.body.nameEnglish;
	// 	newAttraction.nameChinese 	= req.body.nameChinese;
	// 	newAttraction.address 		= req.body.address;
	// 	newAttraction.category		= req.body.category;
	// 	newAttraction.details 		= req.body.details;
	// 	newAttraction.cityCounty 	= req.body.cityCounty;
	// 	newAttraction.district 		= req.body.district;
	// 	newAttraction.lat 			= req.body.lat;
	// 	newAttraction.long 			= req.body.long;

	// 	newAttraction.save(function(err, attraction) {
	// 		if (!err) res.redirect('/#/attractions/' + attraction._id)
	// 	})
	// })

	// attractionsRouter.get('/:attractionId', function(req, res) {
	// 	Attractions.findById(req.params.attractionId, function(err, attraction) {
	// 		if (!err) res.json(attraction);
	// 	})
	// })

	// attractionsRouter.put('/:attractionId', function(req, res) {
	// 	Attractions.findById(req.params.attractionId, function(err, attraction) {
	// 		if (err) res.send(err);

	// 		if (req.body.nameEnglish) attraction.nameEnglish 	= req.body.nameEnglish;
	// 		if (req.body.nameChinese) attraction.nameChinese 	= req.body.nameChinese;
	// 		if (req.body.address) attraction.address 			= req.body.address;
	// 		if (req.body.category) attraction.category 			= req.body.category;
	// 		if (req.body.details) attraction.details 			= req.body.details;
	// 		if (req.body.cityCounty) attraction.cityCounty 		= req.body.cityCounty;
	// 		if (req.body.district) attraction.district 			= req.body.district;
	// 		if (req.body.lat) attraction.lat 					= req.body.lat;
	// 		if (req.body.long) attraction.long 					= req.body.long;

	// 		attraction.save(function(err, attraction) {
	// 			if (!err) res.json(attraction);
	// 		})
	// 	})
	// })

	// attractionsRouter.delete('/:attractionId', function(req, res) {
	// 	Attractions.remove({ _id: req.params.attractionId }, function(err, attraction) {
	// 		if (err) res.send(err);

	// 		res.json({ message: 'Attraction successfully deleted!' });
	// 	})
	// })

}

