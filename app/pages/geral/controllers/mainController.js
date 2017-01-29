define(['msAppJs',
        './menu',
        'pages/home/routes/homeRoute',
        '../../mensagens/routes/mensagensRoute',
        '../../gravacoes/routes/gravacoesRoute'
        ], function(app,
        		menu,
        		homeRoute,
				mensagensRoute,
				gravacoesRoute,
				localizacoesRoute) {
	'use strict';

	/**
	 * Controller da aplicação
	 */
	app.controller('mainController', ['$scope',
	                                  "$timeout",
	                                  '$filter',
	                                  'msAutenticacaoService',
	                                  'msSegurancaService',
	                                  '$state',
	                                  '$rootScope',
	                                  'msRouteService',
	                                  '$http',
	                                  '$translatePartialLoader',
	                                  function($scope,
	                                		  $timeout,
	                                		  $filter,
	                                		  msAutenticacaoService,
	                                		  msSegurancaService,
	                                		  $state,
	                                		  $rootScope,
	                                		  msRouteService,
	                                		  $http,
	                                		  $translatePartialLoader){

		//Carrega as msgs globais para todas as telas
		$translatePartialLoader.addPart('geral');


		//Indica se o sistema ja subiu
		$scope.carregado = true;

		/**
		 * Cria e registra as rotas do sistema
		 */
		msRouteService.create(homeRoute);
		msRouteService.create(mensagensRoute);
		msRouteService.create(gravacoesRoute);
		msRouteService.create(localizacoesRoute);

		$scope.alterarMenu(menu.obterMenu());


		/**
		 * Data atual que é exibida no cabecario
		 */
		$scope.dataAtual = new Date();


		/**
		 * Intercepta o acesso do usuario e verifica se o mesmo escolheu um perfil de acesso
		 * Caso não tenha escolhido, o mesmo eh mandado de volta a pagina de login
		 */
		msAutenticacaoService.recuperarDadosUsuario().then(function(usuario) {
			if(usuario !== undefined && usuario.perfil === undefined) {
				$scope.logout();
			}
		});


		/**
		 * Efetua o logout
		 */
		$scope.logout = function() {
			msAutenticacaoService.sair()
			.then(function(msSegurancaServiceRetorno) {
				$state.go('login');
			}, function(e) {
				$state.go('login');
			});
		};


		/**
		 * Faz um wrapper para exbir mensagens na tela
		 */
		var timeout = null;

		if(!$rootScope.showMsg) {
			$rootScope.showMsg = function (tipo, msg, manterAntigas) {
				var op = "";
				var icon = "";

				var removeMsgs = function (tempoEmMillis){
					if(tempoEmMillis == null){
						$scope.$msAlert.clear();
					} else {
						$timeout.cancel(timeout);
						timeout = $timeout(function(){
							$scope.$msAlert.clear();
						}, tempoEmMillis);
					}
				};

				if(tipo === "E" || tipo === "e"){
					op = "error";
					icon = "<i class=\"font15px fa fa-times-circle\"></i>";
				} else if(tipo === "S" || tipo === "s") {
					op = "success";
					icon = "<i class=\"font15px fa fa-check\"></i>";
				} else if(tipo === "W" || tipo === "w" || tipo == "A" || tipo == "a") { //warning/alert
					op = "warning";
					icon = "<i class=\"font15px fa fa-exclamation-triangle\"></i>";
				} else if(tipo === "I" || tipo === "i") {
					op = "info";
					icon = "<i class=\"font15px fa fa-info-circle\"></i>";
				}

				$timeout(function() {
					msg = msg.replaceAll("'", "\'");

					try {

						if(window.geral.isEmpty(manterAntigas) || manterAntigas === false) {
							removeMsgs();
						}

						eval("$scope.$msAlert."+op+"('"+icon+" "+($filter('translate')(msg))+"');");
					} catch (e) {
						$scope.$msAlert.error(msg+"");
					}

					removeMsgs(20000);
					$('#topoAbsoluto').scrollTo(); //rola para o topo da tela
				},100);
			};
		};
	}]);

	return app;
});