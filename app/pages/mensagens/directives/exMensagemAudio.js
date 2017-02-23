define(['msAppJs','angularMediaPlayer'], function(app) {
	'use strict';

    app.directive('exMensagemAudio', ['mensagensService','$q','$timeout', function (mensagensService, $q, $timeout) {

		function link(scope, element, attrs) {

            scope.baixarAudio = function () {
                mensagensService.carregarArquivo(scope.mensagem);
            };

            mensagensService.carregarMidia(scope.mensagem);

		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			templateUrl: './app/pages/mensagens/directives/templates/exMensagemAudio.html',
			scope: {
				mensagem:"="
			}
		};
	}]);

	return app;
});