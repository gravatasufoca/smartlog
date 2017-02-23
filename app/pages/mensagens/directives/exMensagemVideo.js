define(['msAppJs','angularMediaPlayer'], function (app) {
    'use strict';

    app.directive('exMensagemVideo', ['mensagensService', function (mensagensService) {

        function link(scope, element, attrs) {

            scope.carregarVideo = function () {
                mensagensService.carregarArquivo(scope.mensagem);
            };

            mensagensService.carregarMidia(scope.mensagem);

        }

        return {
            restrict: 'E',
            replace: true,
            link: link,
            templateUrl: './app/pages/mensagens/directives/templates/exMensagemVideo.html',
            scope: {
                mensagem: "="
            }
        };
    }]);

    return app;
});