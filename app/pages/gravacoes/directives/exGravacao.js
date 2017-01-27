define(['msAppJs','angularMediaPlayer'], function(app) {
	'use strict';

    app.directive('exGravacao', ['gravacoesService','$timeout', function (gravacoesService,$timeout) {

		function link(scope, element, attrs) {
		    scope.player={};
            scope.baixarGravacao = function () {
                scope.gravacao.carregando = true;
                scope.gravacao.carregado = false;
                gravacoesService.recuperarArquivo(scope.gravacao.id).then(function (resultado) {
                    console.info("resultado!!!",resultado);
                    if(!geral.isEmpty(resultado)) {
                        scope.gravacao.raw = resultado;
                        scope.gravacao.carregando = false;
                        scope.gravacao.carregado = true;
                    }else{
                        scope.gravacao.carregando=false;
                        scope.gravacao.carregado=false;
                    }
                }, function (e) {
                    $timeout(function () {
                        console.error(e);
                        scope.gravacao.carregando=false;
                        scope.gravacao.carregado=false;
                    }, 100);
                });
            };

            scope.$watch("gravacao.countdown",function (a) {
                if(a==0){
                    scope.baixarGravacao();
                    delete scope.gravacao.countdown;
                }
            });

		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			templateUrl: './app/pages/gravacoes/directives/templates/exGravacao.html',
			scope: {
				gravacao:"="
			}
		};
	}]);

	return app;
});