define(['msAppJs'
        ], function(app) {
	app.factory('testeService', ['resourceRest', function(resourceRest){

		var teste = function() {
			return "OK";
		};


		return { 
			teste : teste
		};

	}]);

	return app;
});