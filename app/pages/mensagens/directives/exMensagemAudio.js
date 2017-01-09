define(['msAppJs'], function(app) {
	'use strict';

    app.directive('exMensagemAudio', ['mensagensService','$q','$timeout', function (mensagensService,$q,$timeout) {

		function link(scope, element, attrs) {
            scope.carregarAudio = function () {
                mensagensService.recuperarArquivo(scope.mensagem.idReferencia).then(function (resultado) {
                    console.info("resultado!!!",resultado);
                    if(resultado!=null && resultado.raw_data!=null) {
                        scope.mensagem.raw = resultado.raw_data;
                        scope.mensagem.carregando = false;
                        scope.mensagem.carregado = true;
                    }else{
                        scope.mensagem.carregando=false;
                        scope.mensagem.carregado=false;
                    }
                }, function (e) {
                    $timeout(function () {
                        console.error(e);
                        scope.mensagem.carregando=false;
                        scope.mensagem.carregado=false;
                    }, 100);
                });
            };
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