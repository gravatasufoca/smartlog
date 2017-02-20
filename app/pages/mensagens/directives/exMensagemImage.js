define(['msAppJs'], function (app) {
    'use strict';

    app.directive('exMensagemImage', ['mensagensService', function (mensagensService) {

        function link(scope, element, attrs) {

            scope.carregarImagem = function () {
                mensagensService.carregarArquivo(scope.mensagem);
            };

            mensagensService.carregarMidia(scope.mensagem);

        }

        return {
            restrict: 'E',
            replace: true,
            link: link,
            templateUrl: './app/pages/mensagens/directives/templates/exMensagemImage.html',
            scope: {
                mensagem: "=",
                force:"="
            }
        };
    }]);

    return app;
});