define(['msAppJs'], 
		function(app) {
	app.factory("configuracoesService", ['resourceRest',
	                             '$rootScope', 
	                             '$translatePartialLoader',
	                             function(resourceRest, 
	                            		 $rootScope, 
	                            		 $translatePartialLoader){

		var recuperarConfiguracao = function() {
			return resourceRest.configuracoes.getList();
		};

		return {
            recuperarConfiguracao : recuperarConfiguracao
		};

	}]);

	return app;
});