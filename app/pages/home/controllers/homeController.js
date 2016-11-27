define(['msAppJs'], function(app) {
	app.controller('homeController', ['$scope', 
	                                  '$translatePartialLoader', 
	                                  function($scope, 
	                                		  $translatePartialLoader){
		$translatePartialLoader.addPart('home');  
		
	}]);
	return app;
});