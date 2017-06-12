define(['msAppJs'], function(app) {
	'use strict';

    app.directive('exGravacao', ['gravacoesService','$timeout','fileSystemService', function (gravacoesService,$timeout,fileSystemService) {

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
                    }, 100);
                });
            };

            scope.$watch("gravacao.countdown",function (a) {
                if(a==0){
                    scope.baixarGravacao();
                    delete scope.gravacao.countdown;
                }
            });

            var getArquivo=function (resp) {
                if(scope.gravacao.tipo!=1) {
                    resp.file(function (file) {
                        $timeout(function () {
                            scope.gravacao.src = URL.createObjectURL(file);
                            scope.gravacao.carregando = false;
                            scope.gravacao.carregado = true;
                        });
                    });
                }else{
                    scope.gravacao.src = resp.toURL();
                    scope.gravacao.carregando = false;
                    scope.gravacao.carregado = true;
                }
            };

            var carregarMidia=function () {
                if(!scope.gravacao.carregando) {

                    if(fileSystemService.requestIncrease()) {
                        fileSystemService.getArquivoUrl(idGravacao).then(function (resp) {
                            if (resp != null) {
                                getArquivo(resp);
                            }
                        }, function () {
                            fileSystemService.cacheArquivo(idGravacao).then(function (resp) {
                                if (resp) {
                                    fileSystemService.getArquivoUrl(idGravacao).then(function (resp) {
                                        if (resp != null) {
                                            getArquivo(resp);
                                        }
                                    });
                                }
                            });
                        });
                    }else{

                        gravacoesService.recuperar(idGravacao).then(function (resp) {
                            var blob=new Blob([resp], {type : scope.gravacao==3?'video/mp4':'audio/ogg'});
                            scope.gravacao.src = URL.createObjectURL(blob);
                            scope.gravacao.carregando = false;
                            scope.gravacao.carregado = true;
                        });

                       /* var def = $q.defer();
                        resourceRest.gravacao.withHttpConfig({responseType: 'blob'}).get(id).then(function (resp) {
                            console.info("requisicao feita1");
                            if (resp==null && time == 60) {
                                def.reject();
                                return null;
                            }
                            if (geral.isEmpty(resp)) {
                                console.info("resp vazia");
                                return recuperarGravacao(id, time + 10);
                            } else {
                                console.info("escrevendo blob");
                                console.info(fileSystem.writeBlob("arquivos/gravacoes/" + id, resp));
                                def.resolve(true);
                            }
                        },function (err) {
                            console.error(err);
                            def.reject();
                        });*/
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