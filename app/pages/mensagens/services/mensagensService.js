define(['msAppJs'
        ], function(app) {
	app.factory('mensagensService', ['resourceRest',"$http", function(resourceRest,$http){

		var recuperarTopicos=function (idAparelho,tab) {

			return resourceRest.topico.one("aparelho",idAparelho).one("tipo",tab.texto.toUpperCase()).getList();
        };

		var recuperarMensagens = function (idTopico) {
			return resourceRest.mensagem.one("topico",idTopico).getList();
        };

		return {
            recuperarTopicos:recuperarTopicos,
			recuperarMensagens:recuperarMensagens

		};

	}]);

	return app;
});