define(['msAppJs'
        ], function(app) {
	app.factory('mensagensService', ['resourceRest',"$http","$q","$timeout", function(resourceRest, $http, $q, $timeout){

		var recuperarTopicos=function (idAparelho,tab,carregados) {
			return resourceRest.topico.one("aparelho",idAparelho).one("tipo",tab.texto.toUpperCase()).one("c",carregados).getList();
        };

		var recuperarMensagens = function (idTopico,carregados) {
			return resourceRest.mensagem.one("topico",idTopico).one("c",carregados).getList();
        };

        var recuperarArquivo = function (idMensagem) {
        	var time=arguments.length>1? arguments[1]:0;
            window.geral.sleep(time*1000);
            console.info(time);
            return resourceRest.mensagem.one("arquivo", idMensagem).one("solicita",time==0).get().then(function (resultado) {
            	console.info(resultado);
            	if(resultado!=null && resultado.success){
            		if(time==60) return null;

            		if(resultado.arquivo==null){
						return recuperarArquivo(idMensagem,time+10);
					}else{
            			return resultado.arquivo;
					}
				}
            });
        };

		return {
            recuperarTopicos:recuperarTopicos,
			recuperarMensagens:recuperarMensagens,
			recuperarArquivo:recuperarArquivo
		};

	}]);

	return app;
});