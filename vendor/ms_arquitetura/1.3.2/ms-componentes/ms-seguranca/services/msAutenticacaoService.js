define([
        'componentes/ms-seguranca/services/msSegurancaService',
        'utils/sha256'
        ], 
        function(msSeguranca) {

	'use strict';

	msSeguranca.factory('msAutenticacaoService', ['$rootScope', '$cookieStore', '$q', 'msSegurancaService', '$http', '$timeout', 
	                                              function($rootScope, $cookieStore, $q, msSegurancaService, $http, $timeout) {

		/*
		 * Private method
		 */
		var recuperarDadosUsuario = function() {

			var deferred = $q.defer();
			var token = msSegurancaService.getToken();
			if(msSegurancaService.isUsuarioAutenticado()) { 

				if(msSegurancaService.getUsuario())
					deferred.resolve(msSegurancaService.getUsuario());
				else {
					///TODO comentar qdo autenticação for local
					$http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
					$http.get(appConfig.login.url_usuario, {token: token})
					.then(function(response){
						$timeout(function() {
                            if(response.data!=null && response.data.resultado!=null) {
                                msSegurancaService.setUsuario(response.data.resultado.usuario);
                            }
							deferred.resolve(msSegurancaService.getUsuario());
						}, true);
					}, function(reason) {
						$rootScope.$broadcast('destuirSessao');
						deferred.reject(reason);
					});
				}
			} else {
				deferred.reject('Usuário não autenticado.');
			}

			return deferred.promise;

		};

		var autenticar = function(email, senha) {
			var deferred = $q.defer();
			var senhaCrypto = CryptoJS.SHA256(senha).toString();

			var credentials = {
					grant_type : 'password',
					client_id : 'clientAngularMS',
					client_secret : 'secret',
					username : email,
					password : senha
			};
			$http({
				url : appConfig.login.url,
				method : 'POST',
				data : credentials
			}).then(function(response) {
				if(response.data.resultado.status=="success") {
                    var token = response.data.resultado.access_token;
                    msSegurancaService.setToken(token);
                    if(response.data!=null && response.data.resultado!=null) {
                        msSegurancaService.setUsuario(response.data.resultado.usuario);
                    }
                    deferred.resolve(msSegurancaService);
                }else{
                    deferred.reject(response.data.resultado.message);
				}
			}, function(reason){
				deferred.reject(reason);
			});

			return deferred.promise;
		};

		var sair = function() {
			try{
				var deferred = $q.defer();

				var param = {
						token : msSegurancaService.getToken()
				};

				$http({
					url : appConfig.logout.url,
					method : 'POST',
					params : param
				}).success(function(data, status, headers, config) {
					msSegurancaService.setUsuarioAutenticado(false);
					deferred.resolve(msSegurancaService);
				});

				return deferred.promise;
			}
			catch(e) {
				$rootScope.$msAlert.error(e);
			}
		};

		return {
			autenticar: autenticar,
			sair: sair,
			recuperarDadosUsuario: recuperarDadosUsuario
		}

	}]);

	return msSeguranca;

});