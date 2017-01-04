define(['msAppJs'], function(app) {
	'use strict';

	app.directive('exMensagemAudio', [function() {

		function link(scope, element, attrs) {

		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			templateUrl: './app/pages/mensagens/directives/templates/exMensagemAudio.html',
			scope: true
		};
	}]);

	return app;
});