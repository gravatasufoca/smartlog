define(['msAppJs','angularMaps'], function(app) {
	'use strict';

    app.directive('exLocalizacao', ['localizacoesService','$timeout','msModalService', function (localizacoesService,$timeout,msModalService) {

		function link(scope, element, attrs) {
		    scope.player={};
            scope.baixarLocalizacao = function () {
                scope.localizacao.carregando = true;
                scope.localizacao.carregado = false;
                localizacoesService.recuperarLocalizacao(scope.localizacao.id).then(function (resultado) {
                    console.info("resultado!!!",resultado);
                    if(!geral.isEmpty(resultado)) {
                        scope.localizacao.latitude = resultado.latitude;
                        scope.localizacao.longitude = resultado.longitude;
                        scope.localizacao.precisao = resultado.precisao;
                        scope.localizacao.carregando = false;
                        scope.localizacao.carregado = true;
                        scope.abrirLocalicacao();
                    }else{
                        scope.localizacao.carregando=false;
                        scope.localizacao.carregado=false;
                    }
                }, function (e) {
                    $timeout(function () {
                        console.error(e);
                        scope.localizacao.carregando=false;
                        scope.localizacao.carregado=false;
                    }, 100);
                });
            };

            scope.$watch("localizacao.countdown",function (a) {
                if(a==0){
                    scope.baixarLocalizacao();
                    delete scope.localizacao.countdown;
                }
            });



            scope.abrirLocalicacao=function () {
                msModalService.setConfig({
                    backdrop: true,
                    keyboard: false,
                    modalFade: true,
                    template : null,
                    size:'md',
                    templateUrl: './app/pages/localizacoes/directives/templates/modalLocalizacao.html',
                    controller : ['$scope',
                        '$rootScope',
                        '$modalInstance',
                        'localizacao',
                        function(
                            $scope,
                            $rootScope,
                            $modalInstance,
                            localizacao){

                            $scope.localizacao = localizacao;
                            $scope.googlekey="AIzaSyDo6tcy0rkqxbUxS-ayykin6XQRhs0fQGE";

                        }],
                    resolve: {
                        localizacao: function(){return scope.localizacao}
                    }
                }).open();

                msModalService.modalInstance.result.then(function (resultado) {

                });
            };

		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			templateUrl: './app/pages/localizacoes/directives/templates/exLocalizacao.html',
			scope: {
				localizacao:"="
			}
		};
	}]);

	return app;
});