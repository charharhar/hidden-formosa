(function() {

	var app = angular.module('hiddenFormosa', [
		'ui.router',
		'zumba.angular-waypoints', 
		'duScroll'
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

		$scope.cities = [
			{
				'place' : 'Taipei',
				'details' : 'Capital of Taiwan',
				'lat' : '25.0333',
				'long' : '121.6333'
			},
			{
				'place' : 'Keelung',
				'details' : 'Heart of new Taipei',
				'lat' : '25.1333',
				'long' : '121.7333'
			},
			{
				'place' : 'Ping Tung',
				'details' : 'Aborigine culture',
				'lat' : '22.6755',
				'long' : '120.4914'
			},
			{
				'place' : 'Kaohsiung',
				'details' : 'Southern most City of Taiwan',
				'lat' : '22.6333',
				'long' : '120.2667'
			},
			{
				'place' : 'Taichung',
				'details' : 'Center City of Taiwan',
				'lat' : '24.1500',
				'long' : '120.6667'
			},
		];

		var mapOptions = {
			zoom: 8,
			center: new google.maps.LatLng(23.75,121),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}

		$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

		$scope.markers = [];

		var infoWindow = new google.maps.InfoWindow();

		var createMarker = function (info) {

			var marker = new google.maps.Marker({
				map: $scope.map,
				position: new google.maps.LatLng(info.lat, info.long),
				title: info.place
			});

			marker.content = '<div class="infoWindowContent"><p class="marker-details">' + info.details + '</p></div>';

			google.maps.event.addListener(marker, 'click', function(){
				infoWindow.setContent('<h4><a class="marker-link" href="#">' + marker.title + '</a></h4>' + marker.content);
				infoWindow.open($scope.map, marker);
			});

			$scope.markers.push(marker);
		}

		for (i = 0; i < $scope.cities.length; i++){
			createMarker($scope.cities[i]);
		}

		// $scope.openInfoWindow = function(e, selectedMarker){
		// 	e.preventDefault();
		// 	google.maps.event.trigger(selectedMarker, 'click');
		// }




		// // ANGULAR MAPS 
		// // =========================================
		// $scope.markers = [
		// 	{
		// 		"id": "1",
		// 		"latitude": "23.5",
		// 		"longitude": "121",
		// 		"title": "Location 1"
		// 	}, 
		// 	{
		// 		"id": "2",
		// 		"latitude": "24.00",
		// 		"longitude": "121",
		// 		"title": "Location 2"
		// 	}, 
		// 	{
		// 		"id": "3",
		// 		"latitude": "24.5",
		// 		"longitude": "121",
		// 		"title": "Location 3"
		// 	}
		// ];

		// $scope.window = {
		// 	model: {},
		// 	show: false,
		// 	options: {
	 //          pixelOffset: {width:-1,height:-30}
	 //        },
		// 	closeClick: function() {
  //               this.show = false;
  //           }
		// }

		// $scope.map = {
		// 	center: { latitude: 23.75, longitude: 121 },
		// 	control: {},
		// 	zoom: 8,
		// 	window: $scope.window,
		// 	markers: $scope.markers,
		// 	markersEvents: {
		// 		click: function(marker, eventName, model, args) {
		// 			$scope.map.window.model = model;
		// 			$scope.map.window.show = true;
			  
		// 		}
		// 	}
		// };

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

