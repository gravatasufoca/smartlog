define(['msAppJs'], function(app) {
	'use strict';

	app.directive('exModalCancelarFatura', ["$rootScope",
	                                         "msModalService",
	                                         "$msNotifyService",
	                                         function($rootScope,
	                                        		 msModalService,
	                                        		 $msNotifyService) {

		function link(scope, element, attrs) {
			//Binda o evento do click para executar a modal
			element.bind("click", function() {
				abrirModalCancelamento(scope.fatura);
			});


			//Chama a funcao de callback quando a reprovacao for concluida
			var onCancelarFn = function(motivo) {
				if(scope.onCancelarFn){
					scope.onCancelarFn({situacao:scope.situacao,motivos:[motivo]});
				}
			};


			/**
			 * Exibe uma modal para cancelamento
			 */
			var abrirModalCancelamento = function (fatura) {

				msModalService.setConfig({
					backdrop: true,
					keyboard: true,
					modalFade: true,
					windowClass : 'modalWidth950 fadeIn40',
					template : null,
					templateUrl: './app/pages/whatsapp/directives/templates/exModalCancelarFatura.html',
					controller : ['$scope',
					              '$modalInstance',
					              "ngTableParams",
					              '$msNotifyService',
					              'fatura',
					              function ($scope,
					            		  $modalInstance,
					            		  ngTableParams,
					            		  $msNotifyService,
					            		  fatura) {

						$scope.fatura = fatura;

						/**
						 * Controla o cadastro ou selecao do motivo de devolucao
						 */
						$scope.formularioCancelamento={motivo:{descricao:null,tipoPublicidade:$scope.fatura.tipoPublicidade,siglaPerfil:$scope.usuarioAutenticado.perfil.perfil.sigla}};

						/**CANC
						 * Confirma a devolução da whatsapp
						 */
						$scope.confimarCancelamento = function() {
							var isReprovacaoValida = function () {
								if(window.geral.isEmpty($scope.formularioCancelamento.motivo.descricao)) {
									$scope.mostrarMsgErro = true;
									$scope.showMsg('E', "necessario-informar-campos-obrigatorios");
									return false;
								}

								return true;
							};


							if(isReprovacaoValida()) {
								$modalInstance.close($scope.formularioCancelamento.motivo);
							}
						};
					}],
					resolve: {
						fatura : function(){
							return fatura;
						}
					}
				}).open();


				/**
				 * Ao fechar a janela de confirmaçao da devolucao, devolve o resultado das operacoes
				 */
				msModalService.modalInstance.result.then(function (motivo) {
					if(motivo) {
						onCancelarFn(motivo);
					}
				});
			};
		}

		return {
			restrict: 'A',
			replace: true,
			link: link,
			scope: {
				fatura : "=",
				situacao:"=",
				onCancelarFn:"="
			}
		};
	}]);

	return app;
});