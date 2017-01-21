define(['msAppJs','angularMediaPlayer'], function(app) {
	'use strict';

    app.directive('exAudio', ['audiosService','$q','$timeout', function (audiosService,$q,$timeout) {

		function link(scope, element, attrs) {
		    scope.player={};
            scope.baixarAudio = function () {
                scope.mensagem.carregando = true;
                scope.mensagem.carregado = false;
                audiosService.recuperarArquivo(scope.mensagem.idReferencia).then(function (resultado) {
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
			templateUrl: './app/pages/audios/directives/templates/exAudio.html',
			scope: {
				mensagem:"="
			}
		};
	}]);

	return app;
});