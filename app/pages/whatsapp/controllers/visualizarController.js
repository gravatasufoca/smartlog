define(['msAppJs'], function(app) {
	'use strict';


	app.controller('visualizarCampanhaController', ['$scope',
	                                                '$timeout',
	                                                '$msNotifyService',
	                                                '$translatePartialLoader',
	                                                'campanhaService',
	                                                '$state',
	                                                '$stateParams',
	                                                function($scope,
	                                                		$timeout,
	                                                		$msNotifyService,
	                                                		$translatePartialLoader,
	                                                		campanhaService,
	                                                		$state,
	                                                		$stateParams){
		$translatePartialLoader.addPart('campanha');

		/**
		 * Capturando parametros de requisiçao
		 */
		$scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams, error) {
			if($stateParams.id) {
				campanhaService.recuperarCampanhaPorId($stateParams.id)
				.then(function(data) {
					$scope.campanha = data.resultado;
					popularMeioTempList();

					campanhaService.listarHistoricoCampanha($stateParams.id)
					.then(function(data) {
						$scope.historicoList = data.resultado;
					});

				}, function(e) {
					$timeout(function() {
						$state.go("campanha");
						$scope.showMsg('E', e.data.mensagens[0].texto);
					},100);
				});
			}
		});


		/**
		 * Popula a lista temporaria para exibicao na grid de agencias
		 */
		var popularMeioTempList = function() {
			angular.forEach($scope.campanha.campanhaAgenciaList, function(campanhaAgencia, key) {
				campanhaAgencia.meioTempList = [];

				angular.forEach(campanhaAgencia.campanhaAgenciaMeioList, function(cam, key) {
					campanhaAgencia.meioTempList.push(cam.tipoFinalidadeMeio);
				});
			});
		};


		/**
		 * Aprova ou reprova uma deteminada campanha
		 */
		$scope.aprovarReprovarCampanha = function(aprovada) {
			$msNotifyService.loading();
			var aprovacao = { aprovada: aprovada, idCampanha: $scope.campanha.id };

			campanhaService.aprovarReprovarCampanha(aprovacao)
			.then(function (data) {
				$msNotifyService.close();
				$scope.showMsg('S', data.mensagens[0].texto);
				$state.go("campanha");
			}, function (e) {
				$msNotifyService.close();
				$scope.showMsg('E', e.data.mensagens[0].texto);
			});
		};

	}]);

	return app;
});