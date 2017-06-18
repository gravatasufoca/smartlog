define(['msAppJs'
        ], function(app) {
	app.factory('gravacoesService', ['resourceRest','$rootScope','indexDBService', function(resourceRest,$rootScope,indexDBService){


		var recuperar = function (id) {
			return resourceRest.gravacao.withHttpConfig({responseType: 'blob'}).get(id);
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
            return indexDBService.cacheArquivo($rootScope.usuarioAutenticado.perfil.id,id);
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