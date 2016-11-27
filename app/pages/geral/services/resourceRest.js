define(['msAppJs'], function(app) {
	app.factory("resourceRest", 
			['Restangular', '$rootScope',
			 function(Restangular, $rootScope) {
				Restangular.setRestangularFields({
					selfLink : 'meta.href'
				});

				//Quando o retorno se trata de um array de dentro do metadado, explicar isso para o restanga
				Restangular.setResponseInterceptor(function(data, operation, what, url, response, deferred) {
					var novoResponse = {};

					if (data && operation === "getList") {
						novoResponse = new Array(); 
						novoResponse.resultado = (data.resultado) ? data.resultado : new Array();
						novoResponse.mensagens = (data.mensagens) ? data.mensagens : null;
					} else {
						novoResponse = data;
					}

					return novoResponse;
				});

				//Pra fazers uns testezinhos
				window.res = Restangular.all(appConfig.appContextRoot + "/api");

				//TODO REFATORAR ESSE CARA, REMOVER ESSES RECURSOS E DEFINIR MANUALLMENTE EM CADA SERVICE. DEIXAR SO O API
				return {
					api : Restangular.all(appConfig.appContextRoot + "/api/v1/v1/"),
					login : Restangular.all(appConfig.appContextRoot + "/api/v1/login")
				};
			} 
			]);
	return app;
});