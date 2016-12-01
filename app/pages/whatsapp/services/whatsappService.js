define(['msAppJs'
        ], function(app) {
	app.factory('whatsappService', ['resourceRest',"$http", function(resourceRest,$http){

		var recuperarTopicos=function (idAparelho) {
			return resourceRest.topico.one("aparelho",idAparelho).getList();
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