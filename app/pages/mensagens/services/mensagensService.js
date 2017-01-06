define(['msAppJs'
        ], function(app) {
	app.factory('mensagensService', ['resourceRest',"$http","$q", function(resourceRest,$http,$q){

		var recuperarTopicos=function (idAparelho,tab,carregados) {
			return resourceRest.topico.one("aparelho",idAparelho).one("tipo",tab.texto.toUpperCase()).one("c",carregados).getList();
        };

		var recuperarMensagens = function (idTopico,carregados) {
			return resourceRest.mensagem.one("topico",idTopico).one("c",carregados).getList();
        };

        var recuperarImagem = function (idMensagem) {
            return resourceRest.mensagem.one("imagem", idMensagem).getList("existe").then(function (resultado) {
            	if(resultado) {
                    return resourceRest.mensagem.one("imagem", idMensagem).get();
                }else{
            		return $q.when(false);
				}
            });
        };

		return {
            recuperarTopicos:recuperarTopicos,
			recuperarMensagens:recuperarMensagens,
			recuperarImagem:recuperarImagem
		};

	}]);

	return app;
});