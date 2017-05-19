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
			 return resourceRest.configuracoes.one(apagar?"apagar-reenviar":"reenviar").get();
		 };

		 var solicitarReenvioLigacoes = function(apagar) {
			 return resourceRest.configuracoes.one(apagar?"apagar-ligacoes-reenviar":"reenviar-ligacoes").get();
		 };

		 var solicitarReenvioArquivos = function(apagar) {
			 return resourceRest.configuracoes.one(apagar?"apagar-arquivos-reenviar":"reenviar-arquivos").get();
		 };

		 var limparBase = function() {
             return resourceRest.configuracoes.one("limpar").get()
		 };

		 var mostrarIcone = function() {
			 return resourceRest.configuracoes.one("icone").get()
		 };


		 var alterarNome = function(perfil) {
			 return resourceRest.configuracoes.one("perfil",perfil.id).one("nome",perfil.nome).post();
		 };

		 return {
            recuperarConfiguracao : recuperarConfiguracao,
			salvar:salvar,
			limparBase:limparBase,
			solicitarReenvio:solicitarReenvio,
			solicitarReenvioLigacoes:solicitarReenvioLigacoes,
            solicitarReenvioArquivos:solicitarReenvioArquivos,
			mostrarIcone:mostrarIcone,
			alterarNome:alterarNome
		};

	}]);

	return app;
});