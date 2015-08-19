(function() {

	var app = angular.module('hiddenFormosa', [
		'ui.router',
		'zumba.angular-waypoints', 
		'duScroll',
		'uiGmapgoogle-maps'
	]).value('duScrollOffset', 1000);

	app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url:'/',
				templateUrl:'partial/home',
				controller:'mainController'
			})
			.state('map', {
				url:'/map',
				controller:'mapController',
				templateUrl:'partial/map'
			})
			.state('taiwan', {
				url:'/about-taiwan',
				templateUrl:'partial/taiwan.ejs'
			})
			.state('attractions', {
				url:'/attractions',
				templateUrl:'partial/attractions.ejs'
			})
			.state('blog', {
				url:'/blog',
				templateUrl:'partial/blog.ejs'
			})
	}])

	// ====================================================================================
	// CONTROLLERS ========================================================================
	// ====================================================================================

	app.controller('mainController', ['$scope', function($scope) {

	}])

	app.controller('mapController', ['$scope', function($scope) {

		$scope.map = { 
			center: { latitude: 23.75, longitude: 121 }, 
			zoom: 8 
		};

	}])

	// ====================================================================================
	// DIRECTIVES =========================================================================
	// ====================================================================================

	app.directive('navDirective', function() {

		var linkFn = function(scope, elem, attrs) {

			// Logo Nav Animation and Controller
			// ======================================================
			$('.nav-logo').on('click', function() {

				if ( !$(this).hasClass('nav-active') ) {
					$('.about-content').removeClass('about-activate');
					$('.view-container').css('margin-top', 0);
				}

				$('.nav-button').removeClass('nav-active');

			})

			// About Content Animation and Controller
			// ======================================================
			var aboutHeight, navHeight;

			$('.nav-about').on('click', function() {
				aboutHeight = $('.about-content').height();
				navHeight = $('nav').outerHeight(true);

				if ( $('.about-content').hasClass('about-activate') ) {
					$('.about-content').removeClass('about-activate');
					$('.view-container').css('margin-top', 0);
				} else {
					$('.about-content').addClass('about-activate');
					$('.view-container').css('margin-top', aboutHeight + navHeight);
				}

			})

			// Navigation animations
			// ======================================================
			$('.nav-button').on('click', function() {

				if ( !$(this).hasClass('nav-active') ) {
					$('.about-content').removeClass('about-activate');
				}

				$('.nav-button').removeClass('nav-active');
				$(this).addClass('nav-active');

			})

		}
		return { link: linkFn }
	})

	app.directive('svgLogo', ['$window', function($window) {

		var linkFn = function(scope, elem, attrs) {

			$('.nav-button').removeClass('nav-active');
			$('.about-content').removeClass('about-activate');

		}

		var controllerFn = function($scope) {

			$scope.routeHome = function() {
				$window.location.href = "/";

			}

		}

		return {
			templateUrl: '../imgs/hidden-formosa-island-color.svg',
			link: linkFn
		}
	}])

}())

