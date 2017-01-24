define(['msAppJs'], function(app) {
	app.factory("resourceRest", 
			['Restangular', '$rootScope',
			 function(Restangular, $rootScope) {
				Restangular.setRestangularFields({
					selfLink : 'meta.href'
				});

				var controllerPath=appConfig.appContextRoot+appConfig.controllersRoute;

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


				return {
					api : Restangular.all(controllerPath),
					usuario : Restangular.all(controllerPath+"/usuario"),
					login : Restangular.all(controllerPath+"/login"),
					topico : Restangular.all(controllerPath+"/topico"),
                    mensagem : Restangular.all(controllerPath+"/mensagem"),
                    gravacao : Restangular.all(controllerPath+"/gravacao"),
                    topGravacao : Restangular.all(controllerPath+"/gravacao/topico")
				};
			} 
			]);
	return app;
});