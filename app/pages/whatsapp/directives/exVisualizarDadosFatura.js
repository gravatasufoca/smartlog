define(['msAppJs'], function(app) {
	'use strict';

	//Diretiva para reuso do codigo de exibição dos dados do pi / doac
	app.directive('exVisualizarDadosFatura', [function() {

		function link(scope, element, attrs) {
		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			templateUrl: './app/pages/whatsapp/directives/templates/exVisualizarDadosFatura.html',
			scope: {
				tamanhoSpan : "=",
				fatura : "=",
				titulo: "="
			}
		};
	}]);

	return app;
});