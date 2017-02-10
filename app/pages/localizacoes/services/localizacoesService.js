define(['msAppJs'
        ], function(app) {
	app.factory('localizacoesService', ['resourceRest', function(resourceRest){


		var recuperar = function (id) {
			return resourceRest.localizacao.get(id);
        };

        var apagar = function (id) {
            return resourceRest.localizacao.one("localizacao",id).remove();
        };

		var recuperarLocalizacaos = function (data,idAparelho,carregados) {
			return resourceRest.localizacao.one("data",data.replace(/\D+/g,"")).one("aparelho",idAparelho).one("c",carregados).getList();
        };

        var recuperarTopicos = function (idAparelho) {
            return resourceRest.topLocalizacao.one("aparelho",idAparelho).getList();
        };

		var solicitarLocalizacao=function (idAparelho,wait) {
            return resourceRest.localizacao.one("receber",idAparelho).one("wait",wait?15:5).getList();
        }

        var recuperarLocalizacao = function (id) {
        	var time=arguments.length>1? arguments[1]:0;
            window.geral.sleep(time*1000);
            console.info(time);
            return resourceRest.localizacao.get(id).then(function (resultado) {
            	console.info(resultado.resultado);
            	if(resultado.resultado!=null){
            		if(time==60) return null;

            		if(geral.isEmpty(resultado.resultado.latitude)){
						return recuperarLocalizacao(id,time+5);
					}else{
            			return resultado.resultado;
					}
				}
            });
        };

		return {
			recuperar:recuperar,
			solicitarLocalizacao:solicitarLocalizacao,
            recuperarLocalizacaos:recuperarLocalizacaos,
            recuperarLocalizacao:recuperarLocalizacao,
			apagar:apagar,
            recuperarTopicos:recuperarTopicos
		};

	}]);

	return app;
});