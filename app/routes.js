// models
var express 		= require('express');
var User 			= require('./models/user.js');

module.exports = function(app, passport) {

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

}

