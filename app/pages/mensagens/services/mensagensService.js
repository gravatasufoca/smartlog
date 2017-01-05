define(['msAppJs'
        ], function(app) {
	app.factory('mensagensService', ['resourceRest',"$http","$q", function(resourceRest,$http,$q){

		var recuperarTopicos=function (idAparelho,tab,carregados) {
			return resourceRest.topico.one("aparelho",idAparelho).one("tipo",tab.texto.toUpperCase()).one("c",carregados).getList();
        };

		var recuperarMensagens = function (idTopico,carregados) {
			return resourceRest.mensagem.one("topico",idTopico).one("c",carregados).getList();
        };

		var recuperarImagem= function (idMensagem) {
			var verificarSeExiste=$q.defer();

            // return resourceRest.mensagem.one("imagem",idMensagem).get();
        };

		return {
            recuperarTopicos:recuperarTopicos,
			recuperarMensagens:recuperarMensagens,
			recuperarImagem:recuperarImagem
		};

	}]);

	return app;
});