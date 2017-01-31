define(['msAppJs'], 
		function(app) {
	app.factory("configuracoesService", ['resourceRest',
	                             '$rootScope', 
	                             '$translatePartialLoader',
	                             function(resourceRest, 
	                            		 $rootScope, 
	                            		 $translatePartialLoader){

		var recuperarConfiguracao = function(idPerfil) {
			return resourceRest.configuracoes.get(idPerfil);
		};

		return {
            recuperarConfiguracao : recuperarConfiguracao
		};

	}]);

	return app;
});