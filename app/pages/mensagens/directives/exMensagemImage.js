define(['msAppJs'], function (app) {
    'use strict';

    app.directive('exMensagemImage', ['mensagensService','$q','$timeout', function (mensagensService,$q,$timeout) {

        function link(scope, element, attrs) {

            scope.carregarImagem = function () {
                scope.mensagem.carregando=true;
                mensagensService.recuperarImagem(scope.mensagem.id).then(function (resultado) {

                    scope.mensagem.carregando=false;
                    scope.mensagem.carregado=true;
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
            templateUrl: './app/pages/mensagens/directives/templates/exMensagemImage.html',
            scope: {
                mensagem: "="
            }
        };
    }]);

    return app;
});