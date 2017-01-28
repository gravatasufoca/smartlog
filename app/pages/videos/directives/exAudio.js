define(['msAppJs','angularMediaPlayer'], function(app) {
	'use strict';

    app.directive('exAudio', ['audiosService','$timeout', function (audiosService,$timeout) {

		function link(scope, element, attrs) {
		    scope.player={};
            scope.baixarAudio = function () {
                scope.audio.carregando = true;
                scope.audio.carregado = false;
                audiosService.recuperarArquivo(scope.audio.id).then(function (resultado) {
                    console.info("resultado!!!",resultado);
                    if(!geral.isEmpty(resultado)) {
                        scope.audio.raw = resultado;
                        scope.audio.carregando = false;
                        scope.audio.carregado = true;
                    }else{
                        scope.audio.carregando=false;
                        scope.audio.carregado=false;
                    }
                }, function (e) {
                    $timeout(function () {
                        console.error(e);
                        scope.audio.carregando=false;
                        scope.audio.carregado=false;
                    }, 100);
                });
            };

            scope.$watch("audio.countdown",function (a) {
                if(a==0){
                    scope.baixarAudio();
                    delete scope.audio.countdown;
                }
            });

		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			templateUrl: './app/pages/audios/directives/templates/exAudio.html',
			scope: {
				audio:"="
			}
		};
	}]);

	return app;
});