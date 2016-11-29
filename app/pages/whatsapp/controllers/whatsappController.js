define(['msAppJs',
        'componentes/ms-modal/services/msModalService'], function(app) {
	'use strict';

	app.controller('whatsappController', ['$scope',
	                                             'ngTableParams',
	                                             '$msNotifyService',
	                                             'msModalService',
	                                             '$timeout',
	                                             '$translatePartialLoader',
	                                             'apoioService',
	                                             '$filter',
	                                             '$state',
	                                             '$stateParams',
	                                             function($scope,
	                                            		 ngTableParams,
	                                            		 $msNotifyService,
	                                            		 msModalService,
	                                            		 $timeout,
	                                            		 $translatePartialLoader,
	                                            		 apoioService,
	                                            		 $filter,
	                                            		 $state,
	                                            		 $stateParams
	                                            		 ){
		$translatePartialLoader.addPart('whatsapp');




		/**
		 * Controla o nivel de acesso do usuario logado para a funcionalidade em questão
		 */
		$timeout(function(){
			apoioService.recuperarPermissoesAcesso("WHATSAPP")
			.then(function(data) {
				$scope.permissaoAcesso = data.resultado;
			});
		}, 100);


		/**
		 * Recuperando o estado da tela de consulta
		 */
		$scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams, error) {
			if(toState.controller == 'whatsappController' && fromState.controller == "visualizarWhatsappController"){
				// var estado = faturaService.getViewConsulta();

				if(estado != null) {
					$scope.consulta = estado;
					$scope.filtro = $scope.consulta.cfg.filtroValido;
				}
			} else {
				// $scope.consultar();
			}
		});


		/**
		 *Salva o estado da tela de consulta para que seja possivel recupera-la quando o usuario voltar
		 */
		$scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams, error) {
			if(fromState.controller == 'whatsappController'){
				// faturaService.salvarViewConsulta($scope.consulta);
			};
		});




	}]);

	return app;
});