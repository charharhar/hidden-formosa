(function() {

	var app = angular.module('hiddenFormosa', [
		'ui.router',
		'zumba.angular-waypoints'
	])

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
				controller: ['$scope', function($scope) {
					navHeight = $('nav').outerHeight(true);
					windowHeight = window.innerHeight;
					$('.hero-overlay').css('height', windowHeight - navHeight - 100);
				}]
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
			.state('aborigine', {
				url:'/aborigine',
				controller:'aborigineController',
				templateUrl:'partial/aborigine.ejs'
			})
			.state('blog', {
				url:'/blog',
				controller:'blogController',
				templateUrl:'partial/blog.ejs'
			})
	}])

// ====================================================================================
// CONTROLLERS ========================================================================
// ====================================================================================

	app.controller('mapController', ['$scope', 'attractionsFactory', function($scope, attractionsFactory) {

		attractionsFactory.getAll()
			.success(function(data) {
				console.log(data);
				$scope.attractions = data;

				for (i = 0; i < $scope.attractions.length; i++){
					createMarker($scope.attractions[i]);
				}
			});

		var mapOptions = {
			zoom: 8,
			center: new google.maps.LatLng(23.75,121),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
			zoomControl:true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL,
				position: google.maps.ControlPosition.RIGHT_CENTER
			},
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
				mapTypeIds: [
					google.maps.MapTypeId.ROADMAP,
					google.maps.MapTypeId.TERRAIN
				]
			}

		}

		$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
		var infoWindow = new google.maps.InfoWindow();
		$scope.markers = [];

		// dynamically create markers by loading up marker information, building the HTML using setContent, and then pushing to marker array
		var createMarker = function (info) {

			var marker = new google.maps.Marker({
				map: $scope.map,
				position: new google.maps.LatLng(info.lat, info.long),
				title: info.nameEnglish,
				id: info._id,
				category: info.category,
				details: info.details
			});

			marker.content = '<div class="infoWindowContent"><p class="marker-details">' + info.address + '</p></br><p class="marker-category">' + info.category + '</p></div>';

			google.maps.event.addListener(marker, 'click', function(){
				infoWindow.setContent('<h4 class="marker-heading">' + marker.title + '</h4>' + marker.content);
				infoWindow.open($scope.map, marker);
			});

			$scope.markers.push(marker);
		}

		// default filter selected being all
		$scope.categoryFilter = 'all';

		// setting the default header and details to explain how the map works
		$scope.attraction = {
			nameEnglish: 'ForMAPsa',
			details: 'Have a look through our recommended hotspots of Taipei! Filter by category by clicking above and start scrolling through the attractions on the sidebar. Click on the attraction to view its location on the map!'
		}

		// function for clicking on specific attraction in database list
		$scope.openInfoWindow = function(e, selectedMarker){
			e.preventDefault();
			google.maps.event.trigger(selectedMarker, 'click');

			// loads up the details for specifically clicked data
			attractionsFactory.getAttraction(selectedMarker.id)
				.success(function(data) {
					$scope.attraction = data;
					console.log($scope.attraction);
				})

			// zoom in on map and center the pin
			$scope.map.setZoom(17);
			$scope.map.setCenter(selectedMarker.getPosition());
		}

	}])

	app.controller('blogController', ['$scope', '$sce', 'blogsFactory', function($scope, $sce, blogsFactory) {

		// Default blog data
		$scope.blog = {
			title: 'WEEKLY BLOG'
		}

		blogsFactory.getAll()
			.success(function(data) {
				$scope.blogs = data;
				console.log(data);
				
			})

		$scope.openSelectedArticle = function(blogId) {
			blogsFactory.getBlog(blogId)
				.success(function(data) {
					$scope.blog = data;
					$scope.htmlFormat = $sce.trustAsHtml($scope.blog.content);
				})
		}

	}])

	app.controller('aborigineController', ['$scope', function($scope) {

		// Set Options
		var speed = 500;
		var autoswitch = true;
		var autoswitch_speed = 4000;

		var slide = $('.aborigine-slide');

		// Add initial active class
		slide.first().addClass('active');

		// Hide all slides
		slide.hide();

		// Show first slide
		$('.active').show();

		if (autoswitch == true) {
			setInterval(nextSlide, autoswitch_speed);
		}

		function nextSlide() {
			$('.active').removeClass('active').addClass('oldActive');
			// if on the last slide, we want the first slide to come back
			if ( $('.oldActive').is(':last-child') ) {
				slide.first().addClass('active');
			} else {
				$('.oldActive').next().addClass('active');
			}
			$('.oldActive').removeClass('oldActive');
			slide.fadeOut(speed);
			$('.active').fadeIn(speed);
		}

		function prevSlide() {
			$('.active').removeClass('active').addClass('oldActive');
			// if on the last slide, we want the first slide to come back
			if ( $('.oldActive').is(':first-child') ) {
				slide.last().addClass('active');
			} else {
				$('.oldActive').prev().addClass('active');
			}
			$('.oldActive').removeClass('oldActive');
			slide.fadeOut(speed);
			$('.active').fadeIn(speed);
		}

		// Typed.js method
		var featuredTour = 'Da Wu Shan';

		$(function(){
			$(".typed-element").typed({
				strings: ['Featured this month ^500', featuredTour],
				typeSpeed: 150
			});
		});

		// aborigine nav link functions 
		// ==== NEED A DIRECTIVE =====
		$('#read-more').on('click', function() {
			$('.aborigine-more').toggleClass('visible');
		})

		$('#booking').on('click', function() {
			$('.aborigine-booking').toggleClass('aborigine-booking-activate')
		})

	}])

// ====================================================================================
// SERVICES =========================================================================
// ====================================================================================
	
	app.factory('attractionsFactory', ['$http', function($http) {
		var attractionsFactory = {};

		// get a single attraction
		attractionsFactory.getAttraction = function(id) {
			return $http.get('/attractions/' + id);
		}

		// get all the attractions
		attractionsFactory.getAll = function() {
			return $http.get('/attractions');
		}

		// create an attraction
		attractionsFactory.create = function(attractionsData) {
			return $http.post('/attractions/', attractionsData);
		}

		// update an attraction
		attractionsFactory.update = function(id, attractionsData) {
			return $http.put('/attractions/' + id, attractionsData);
		}
		
		// delete an attraction
		attractionsFactory.delete = function(id) {
			return $http.delete('/attractions/' + id);
		}

		return attractionsFactory;
	}])

	app.factory('blogsFactory', ['$http', function($http) {
		var blogsFactory = {};

		// get a single blog
		blogsFactory.getBlog = function(id) {
			return $http.get('/blogs/' + id);
		}

		// get all the blogs
		blogsFactory.getAll = function() {
			return $http.get('/blogs');
		}

		return blogsFactory;

	}])

// ====================================================================================
// DIRECTIVES =========================================================================
// ====================================================================================
	
	app.directive('blogDirective', ['$timeout', function($timeout) {

		var linkFn = function(scope, elem, attrs) {

			$('.blog-link').on('click', function() {
				$('.blog-container').addClass('animated fadeOutRight');
				$('.content-container').addClass('animated fadeInLeft');

				$('.blog-container').removeClass('fadeInLeft');
				$('.content-container').removeClass('fadeOutRight');

				$timeout(function() {
					$('.blog-link').css('display','none');
					$('.blog-container').css('position','absolute');
					$('.blog-content-container').css('display','block');
				}, 800)

			})

			$('.blog-return').on('click', function() {
				$('.blog-container').addClass('animated fadeInLeft');
				$('.content-container').addClass('animated fadeOutRight');

				$('.blog-container').removeClass('fadeOutRight');
				$('.content-container').removeClass('fadeInLeft');

				// handling positioning and animation details
				$('.blog-link').css('display','block');
				$('.blog-container').css('position','relative');
				$('.blog-content-container').css('display','none');
			})

		}

		return { link: linkFn }

	}])

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

			// Login & Signup manipulations
			// ======================================================
			$('.nav-login').on('click', function() {
				$('.login-signup-wrapper').css('display', 'block');
				$('.login').addClass('form-active');
			})

			$('.swap-to-signup').on('click', function() {
				$('.signup').addClass('form-active')
				$('.login').removeClass('form-active');
			})

			$('.swap-to-login').on('click', function() {
				$('.login').addClass('form-active')
				$('.signup').removeClass('form-active');
			})

			$('.btn-home').on('click', function() {
				$('.login-signup-wrapper').css('display','none');
				$('.login, .signup').removeClass('form-active');
			})

			var KEYCODE_ESC = 27;
			$(document).on({
				keyup: function(e) {
					if (e.keyCode == KEYCODE_ESC) {
						$('.login-signup-wrapper').css('display','none');
						$('.login, .signup').removeClass('form-active');
					}
				}
			})

		} // linkFn end
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

	app.directive('bgVideo', function() {

		var linkFn = function(scope, elem, attrs) {

			// setting div.hero-overlay to dynamically have same height as the video-container
			elem.height($('.video-visible').height());

		}

		return { link: linkFn }

	})

}())

