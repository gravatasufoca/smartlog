define(['msAppJs'], function(app) {
	'use strict';

	app.directive('exMensagemVideo', [function() {

		function link(scope, element, attrs) {

		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			templateUrl: './app/pages/mensagens/directives/templates/exMensagemVideo.html',
			scope: true
		};
	}]);

	return app;
});