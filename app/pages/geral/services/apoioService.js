define(['msAppJs'], function(app) {
	app.factory('apoioService', ['$q',
	                             '$http',
	                             '$timeout',
	                             '$rootScope',
	                             'resourceRest',
	                             'ngTableParams',
	                             '$msNotifyService',
	                             function($q,
	                            		 $http,
	                            		 $timeout,
	                            		 $rootScope,
	                            		 resourceRest,
	                            		 ngTableParams,
	                            		 $msNotifyService){


		/**
		 * Guarda os dados da view de Consulta, achei que desse modo fica mais organizado e intuitivo.
		 * Essa ideia tambem surgiu com a necessidade de manter o estado dessa tela quando o usuario avança para um novo cadastro,
		 * uma alteracao, ou visualizacao de registro.
		 * Com a mudanca, os dados se perdem, dai centraliza los aqui facilita salvar na service de Conta.
		 */
		var ConsultaView = function(filtro, funcaoConsulta) {
			var cfg = {
					funcaoConsulta: funcaoConsulta,
					filtro: filtro,
					filtroValido: null,
					mostraTabela: false
			};

			return {
				cfg: cfg,
				//Tabela de registros onde é exibido o resultado da consulta
				tabela: new ngTableParams({
					page: 1,
					count: 10,
					sorting: {anoExercicio : 'desc'},
				}, {
					total: 0,
					getData: function ($defer, params) {
						if(cfg.mostraTabela) {
							$msNotifyService.loading();
							if(cfg.filtroValido.isNovaConsulta) {
								params.$params.page = 1;
								cfg.filtroValido.isNovaConsulta = false;
							}

							for (var campo in params.$params.sorting) break;

							cfg.filtroValido.paginacao = {
									paginaAtual: params.$params.page,
									quantidadeRegistroPagina: params.$params.count,
									campo: campo,
									ordem: params.$params.sorting[campo].toUpperCase()
							};

							cfg.funcaoConsulta(cfg.filtroValido)
							.then(function(data) {
								params.total(data.resultado.count);

								if(data.resultado.count === 0) {
									$rootScope.showMsg('W', "nenhum-registro-encontrado");
								}
								$msNotifyService.close();
								$defer.resolve(data.resultado.dados);
							}, function(error) {
								$rootScope.showMsg('E', error.data.mensagens[0].texto);
								$msNotifyService.close();
							});
						}
					}
				})
			};
		};



		var recuperarPermissoesAcesso = function(sigla) {
			return resourceRest.api.all("apoio").one("permissao-acesso", sigla).get();
		};


		/**
		 * Cacher generico para listas
		 * A ideia e reduzir a redundancia de consultas...
		 */
		var genericArrayCacher = function(promiseFn, finalPath, cachedArray) {
			console.log("Caching ", finalPath, "...");
			var deferred = $q.defer();

			if(window.geral.isEmpty(cachedArray)) {
				promiseFn(finalPath)
				.then(function(data) {
					cachedArray = [];
					angular.forEach(data.resultado, function(obj) {
						cachedArray.push(obj);
					});
					console.log("Cache saved: ", finalPath);
					deferred.resolve({resultado : cachedArray});
				}, function(err) {
					deferred.reject(err);
				});
			} else {
				console.log("Cache recovered: ", finalPath);
				deferred.resolve({resultado : cachedArray});
			}

			return deferred.promise;
		};

		var isConectado = function (inativa) {
            return resourceRest.api.all("fcm").one('ativo',inativa).get();
        };

		return {
			genericArrayCacher : genericArrayCacher,
			recuperarPermissoesAcesso : recuperarPermissoesAcesso,
			ConsultaView : ConsultaView,
			isConectado:isConectado
		};

	}]);
	return app;
});