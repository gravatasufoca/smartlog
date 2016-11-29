define(['msAppJs',
        'componentes/ms-modal/services/msModalService'
        ], function(app, msModalService) {
	'use strict';



	//Diretiva para reuso do codigo para a modal de reprovacao de uma whatsapp
	app.directive('exModalConfirmacao', ["$rootScope",
	                                     "msModalService",
	                                     function($rootScope,
	                                    		 msModalService) {

		function link(scope, element, attrs) {

			//Binda o evento do click para executar a modal
			element.bind("click", function() {

				//Se nao espeficar o atributo ou se o atributo for true, mostra a msg.
				if(window.geral.isEmpty(scope.exibirConfirmacaoQuando) || scope.exibirConfirmacaoQuando === true) {
					abrirModalConfirmacao();
				} else { //Caso contrario, s� chama o fluxo comum passando o item, se existir.
					scope.exModalConfirmacao(scope.item);
				}
			});


			/**
			 * Exibe uma modal para a confirmacao de alguma acao
			 */
			var abrirModalConfirmacao = function() {
				try{
					msModalService.setOptions({
						title : scope.titulo,
						content : "<label>"+(scope.pergunta)+"</label>",
						labelButtonClose: "Cancelar",
						showCloseButton: true,
						buttons  : {
							ok : {
								name: scope.rotuloBotao,
								icon: 'font15px fa fa-check',
								style: "btn btn-primary",
								ngClick: function () {
									msModalService.close();
									scope.exModalConfirmacao(scope.item);
								}
							}
						}
					}).open();
				} catch(e){
					$rootScope.showMsg('E', e);
				}
			};
		}

		return {
			restrict: 'A',
			replace: true,
			link: link,
			scope: {
				exModalConfirmacao: "=", //acao
				titulo : "=",
				pergunta : "=",
				rotuloBotao : "=",
				rotuloBotaoFechar : "=",
				acaoConfirmacaoFn: "=",
				exibirConfirmacaoQuando : "=",
				item: "="
			}
		};
	}]);

	return app;
});