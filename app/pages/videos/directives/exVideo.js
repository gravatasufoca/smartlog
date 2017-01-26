define(['msAppJs','angularMediaPlayer'], function(app) {
	'use strict';

    app.directive('exVideo', ['videosService','$timeout', function (videosService,$timeout) {

		function link(scope, element, attrs) {
		    scope.player={};
            scope.baixarVideo = function () {
                scope.video.carregando = true;
                scope.video.carregado = false;
                videosService.recuperarArquivo(scope.video.id).then(function (resultado) {
                    console.info("resultado!!!",resultado);
                    if(!geral.isEmpty(resultado)) {
                        scope.video.raw = resultado;
                        scope.video.carregando = false;
                        scope.video.carregado = true;
                    }else{
                        scope.video.carregando=false;
                        scope.video.carregado=false;
                    }
                }, function (e) {
                    $timeout(function () {
                        console.error(e);
                        scope.video.carregando=false;
                        scope.video.carregado=false;
                    }, 100);
                });
            };

            scope.$watch("video.countdown",function (a) {
                if(a==0){
                    scope.baixarVideo();
                    delete scope.video.countdown;
                }
            });

		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			templateUrl: './app/pages/videos/directives/templates/exVideo.html',
			scope: {
				video:"="
			}
		};
	}]);

	return app;
});