define(['msAppJs'
        ], function(app) {
	app.factory('audiosService', ['resourceRest',"$http","$q","$timeout", function(resourceRest,$http,$q,$timeout){


		var recuperar = function (id) {
			return resourceRest.gravacao.get(id);
        };

        var apagar = function (id) {
            return resourceRest.gravacao.one("gravacao",id).remove();
        };

		var recuperarAudios = function (idAparelho,carregados) {
			return resourceRest.gravacao.one("aparelho",idAparelho).one("tipo",0).one("c",carregados).getList();
        };

		var solicitarAudio=function (idAparelho,duracao) {
            return resourceRest.gravacao.one("aparelho",idAparelho).one("tipo",0).one("duracao",duracao).getList();
        }

        var recuperarGravacao = function (id) {
        	var time=arguments.length>1? arguments[1]:0;
            window.geral.sleep(time*1000);
            console.info(time);
            return resourceRest.gravacao.get(id).then(function (resultado) {
            	console.info(resultado.resultado);
            	if(resultado.resultado!=null){
            		if(time==60) return null;

            		if(geral.isEmpty(resultado.resultado.raw)){
						return recuperarGravacao(id,time+10);
					}else{
            			return resultado.resultado.raw;
					}
				}
            });
        };

		return {
			recuperar:recuperar,
			solicitarAudio:solicitarAudio,
            recuperarAudios:recuperarAudios,
			recuperarArquivo:recuperarGravacao,
			apagar:apagar
		};

	}]);

	return app;
});