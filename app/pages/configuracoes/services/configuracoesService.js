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

		 var solicitarReenvio = function(apagar) {
		 	console.info(apagar);
			 return resourceRest.configuracoes.one(apagar?"apagar-reenviar":"reenviar").get();
		 };

		 var limparBase = function() {
             return resourceRest.configuracoes.one("limpar").get()
		 };

		return {
            recuperarConfiguracao : recuperarConfiguracao,
			salvar:salvar,
			limparBase:limparBase,
			solicitarReenvio:solicitarReenvio
		};

	}]);

	return app;
});