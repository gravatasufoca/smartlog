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

		var salvar=function (configuracao) {
			return resourceRest.configuracoes.post(configuracao);
        };

		return {
            recuperarConfiguracao : recuperarConfiguracao,
			salvar:salvar
		};

	}]);

	return app;
});