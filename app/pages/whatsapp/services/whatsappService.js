define(['msAppJs'
        ], function(app) {
	app.factory('whatsappService', ['resourceRest',"$http", function(resourceRest,$http){

		var recuperarTopicos=function (idAparelho) {
			return resourceRest.topico.one("aparelho",idAparelho).getList();
        };

		return {
            recuperarTopicos:recuperarTopicos

		};

	}]);

	return app;
});