define(['msAppJs'], function (app) {
    'use strict';

    app.controller('configuracoesController', ['$scope','$rootScope',
        '$msNotifyService',
        '$timeout',
        '$translatePartialLoader',
        'configuracoesService',
        '$state',
        '$stateParams',
        function ($scope,$rootScope,
                  $msNotifyService,
                  $timeout,
                  $translatePartialLoader,
                  configuracoesService,
                  $state,
                  $stateParams) {
            $translatePartialLoader.addPart('configuracoes');

            /**
             * Capturando parametros de requisiçao
             * Esse metodo é muito importante, pois ele define alguns dados que sao salvos
             * ao avançar de uma tela para outra, algumas regras de carregamento, etc.
             */
            $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams, error) {
                var usuario=$rootScope.usuarioAutenticado;
                if(usuario!=null && usuario.perfil!=null){
                    configuracoesService.recuperarConfiguracao(usuario.perfil.id).then(function (resp) {
                        $scope.configuracao=resp.resultado;
                    },function (e) {
                        $scope.showMsg('E', e);
                    });
                }

            });

            /**
             * Guarda a situacao do formulario apresentado na tela
             */
            $scope.formularioAlterado = false;

            var Configuracao=function () {
				return {
                    avatar:null,
                    media:null,
                    whatsapp:null,
                    messenger:null,
                    smsblacklist:null,
                    callBlacklist:null,
                    wifi:null,
                    intervalo:null
				}
            };

            $scope.configuracao={};

            /**
             * Método que aciona o botão voltar
             */
            $scope.voltar = function () {
                $state.go("home", {}, {reload: true});
            };


            /**
             * Metodo de cadastro/ateracao de criadouro
             */
            $scope.salvarConfiguracao = function () {
                if (isCadastroValido()) {
                    $msNotifyService.loading();

                    configuracoesService.salvar($scope.configuracao)
                        .then(function (data) {
                            $msNotifyService.close();
                            $scope.showMsg('S', data.mensagens[0].texto);
                            $state.go("configuracoes");
                        }, function (e) {
                            $msNotifyService.close();
                            $scope.showMsg('E', e.data.mensagens[0].texto);
                        });
                }
            };


            /**
             * Valida o formulario de Cadastro / Alteracao para verificar se os dados obrigatorios
             * estao presentes
             */
            var isCadastroValido = function () {
                if (window.geral.isEmpty($scope.configuracao.intervalo)) {

                    $scope.criadouro.mostrarMsgErro = true;
                    $scope.showMsg('E', "necessario-informar-campos-obrigatorios");
                    return false;
                }
                return true;
            };
        }]);

    return app;
})
;