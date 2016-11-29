define(['msAppJs'], function(app) {
	'use strict';

	
	/**
	 * TODO REFATORAR PARA USAR ESCOPO ISOLADO
	 */
	//Diretiva para reuso do codigo de exibição dos dados do pi / doac
	app.directive('exDadosManterFatura', [function() {

		function link(scope, element, attrs) {
			attrs.substituir && (scope.substituir = attrs.substituir === 'true' ? true : false);
			//attrs.whatsapp && (scope.whatsapp=attrs.whatsapp);
		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			templateUrl: './app/pages/whatsapp/directives/templates/exDadosManterFatura.html',
			scope: true
		};
	}]);

	return app;
});