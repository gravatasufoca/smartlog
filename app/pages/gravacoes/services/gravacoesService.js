define(['msAppJs'
        ], function(app) {
	app.factory('gravacoesService', ['resourceRest', function(resourceRest){


		var recuperar = function (id) {
			return resourceRest.gravacao.get(id);
        };

        var apagar = function (id) {
            return resourceRest.gravacao.one("gravacao",id).remove();
        };

		var recuperarGravacaos = function (data,idAparelho,tipo,carregados) {
			return resourceRest.gravacao.one("data",data.replace(/\D+/g,"")).one("aparelho",idAparelho).one("tipo",tipo).one("c",carregados).getList();
        };

        var recuperarTopicos = function (idAparelho,tipo) {
            return resourceRest.topGravacao.one("aparelho",idAparelho).one("tipo",tipo).getList();
        };

		var solicitarGravacao=function (idAparelho,duracao,tipo,cameraFrente) {
            return resourceRest.gravacao.one("aparelho",idAparelho).one("tipo",tipo).one("duracao",duracao).one("cameraFrente",cameraFrente!=null && cameraFrente?true:false).getList();
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
			solicitarGravacao:solicitarGravacao,
            recuperarGravacaos:recuperarGravacaos,
			recuperarArquivo:recuperarGravacao,
			apagar:apagar,
            recuperarTopicos:recuperarTopicos
		};

	}]);

	return app;
});