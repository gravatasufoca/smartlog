define(['msAppJs'], function(app) {
	'use strict';

	//Diretiva para reuso do codigo de exibição dos dados do pi / doac
	app.directive('exDadosFaturaAp', [function() {

		function link(scope, element, attrs) {
			
			/**
			 * Atualiza o valor final, que fica em whatsapp
			 */
			scope.$watchCollection("[whatsapp.aprovacaoProducao.valor, whatsapp.aprovacaoProducao.honorario]",function(newValue, oldValue) {
				if(scope.fatura && scope.fatura.aprovacaoProducao && scope.fatura.aprovacaoProducao.valor) {
					var valor = scope.fatura.aprovacaoProducao.valor.realToFloat();
				} else {
					var valor = 0;
				}
				
				if(scope.fatura && scope.fatura.aprovacaoProducao && scope.fatura.aprovacaoProducao.honorario) {
					var honorario = scope.fatura.aprovacaoProducao.honorario.realToFloat();
				} else {
					var honorario = 0;
				}

				scope.fatura.valor = valor - honorario;
				scope.fatura.valor = scope.fatura.valor.formatReal();
			});

		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			templateUrl: './app/pages/whatsapp/directives/templates/exDadosFaturaAp.html',
			scope: {
				tamanhoSpan : "=",
				fatura : "=",
			}
		};
	}]);

	return app;
});