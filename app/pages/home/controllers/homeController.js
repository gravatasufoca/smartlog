define(['msAppJs'], function(app) {
	app.controller('homeController', ['$scope', 
	                                  '$translatePartialLoader',
		// 'ngMap',
	                                  function($scope, 
	                                		  $translatePartialLoader
										  // ,ngMap
											   ){
		$translatePartialLoader.addPart('home');

	}]);
	return app;
});