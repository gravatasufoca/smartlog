define(['msAppJs'], function(app) {
	'use strict';

    app.directive('exGravacao', ['gravacoesService','$timeout','$rootScope','indexDBService', function (gravacoesService,$timeout,$rootScope,indexDBService) {

		function link(scope, element, attrs) {

		    scope.player={};
		    if(scope.gravacao!=null) {
                var idGravacao = scope.gravacao.arquivo_id != null ? scope.gravacao.arquivo_id : scope.gravacao.id;
            }
            scope.baixarGravacao = function () {
                scope.gravacao.carregando = true;
                scope.gravacao.carregado = false;
                scope.gravacao.playlist={};
                gravacoesService.recuperarArquivo(idGravacao).then(function (resultado) {
                    console.info("resultado!!!",resultado);
                    scope.gravacao.carregando=false;
                    scope.gravacao.carregado=false;
                    if(!geral.isEmpty(resultado)) {
                       carregarMidia();
                    }
                }, function (e) {
                    $timeout(function () {
                        console.error(e);
                        scope.gravacao.carregando=false;
                        scope.gravacao.carregado=false;
                    }, 500);
                });
            };

            scope.$watch("gravacao.countdown",function (a) {
                if(a==0){
                    scope.baixarGravacao();
                    delete scope.gravacao.countdown;
                }
            });

            var getBlob=function (resp) {
                var mime;
                switch (scope.gravacao){
                    case 1:
                        mime='image/jpge';
                        break;
                    case 2:
                        mime='audio/ogg';
                        break;
                    case 3:
                        mime='video/mp4';
                        break;
                    default:
                        mime='image/jpge';

                }

                return new Blob([resp], {type: mime});
            };

            var getArquivo=function (resp) {
                if(resp) {
                    $timeout(function () {
                        $timeout(function () {
                            scope.gravacao.src = URL.createObjectURL(getBlob(resp));
                            scope.gravacao.carregando = false;
                            scope.gravacao.carregado = true;
                        });
                    },500);
                }
            };
            var carregarMidia = function () {
                var usuario = $rootScope.usuarioAutenticado;
                if (usuario != null && usuario.perfil != null) {
                    if (!scope.gravacao.carregando) {
                        indexDBService.getArquivoUrl(usuario.perfil.id,idGravacao).then(function (resp) {
                            if (resp != null) {
                                getArquivo(resp);
                            }
                        });
                    }
                }
            };
            carregarMidia();
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