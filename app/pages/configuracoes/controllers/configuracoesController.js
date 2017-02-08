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

                        $scope.configuracao.wifi=$scope.configuracao.wifi=="1";
                        $scope.configuracao.avatar=$scope.configuracao.avatar=="1";
                        $scope.configuracao.whatsapp=$scope.configuracao.whatsapp=="1";
                        $scope.configuracao.messenger=$scope.configuracao.messenger=="1";
                        $scope.configuracao.media=$scope.configuracao.media=="1";
                        $scope.configuracao.intervalo=parseInt($scope.configuracao.intervalo);

                        $scope.configuracao.smsBlacklist=$scope.configuracao.smsBlacklist!=null?$scope.configuracao.smsBlacklist.split("#"):[];
                        $scope.configuracao.callBlacklist=$scope.configuracao.callBlacklist!=null ?$scope.configuracao.callBlacklist.split("#"):[];

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
                    smsBlacklist:null,
                    callBlacklist:null,
                    wifi:null,
                    intervalo:null
				}
            };

            $scope.configuracao={};
            $scope.smsBlack={};
            $scope.callBlack={};

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

                    $scope.configuracao.mostrarMsgErro = true;
                    $scope.showMsg('E', "necessario-informar-campos-obrigatorios");
                    return false;
                }
                return true;
            };

            $scope.removerSms=function (smsBlack) {
                $scope.configuracao.smsBlacklist=  _.reject($scope.configuracao.smsBlacklist, function (item) {
                        return item.numero == smsBlack.numero;
                }) ;
            };

            $scope.adicionarSms = function () {
                if (window.geral.isEmpty($scope.smsBlack) || window.geral.isEmpty($scope.smsBlack.numero)) {
                    $scope.smsBlack.mostrarMsgErro = true;
                    $scope.showMsg('E', "necessario-informar-campos-obrigatorios");
                }else{
                    if($scope.configuracao.smsBlacklist==null){
                        $scope.configuracao.smsBlacklist=[];
                    }
                    if(_.find($scope.configuracao.smsBlacklist,function (item) {
                            return item.numero==$scope.smsBlack.numero;
                        })==null) {
                        $scope.configuracao.smsBlacklist.push({numero:$scope.smsBlack.numero});
                        $scope.smsBlack = {};
                    }else{
                        $scope.smsBlack.mostrarMsgErro = true;
                        $scope.showMsg('E', "numero-ja-adicionado");
                    }
                }
            }



            $scope.removerCall=function (callBlack) {
                $scope.configuracao.callBlacklist=  _.reject($scope.configuracao.callBlacklist, function (item) {
                    return item.numero == callBlack.numero;
                }) ;
            };

            $scope.adicionarCall = function () {
                if (window.geral.isEmpty($scope.callBlack) || window.geral.isEmpty($scope.callBlack.numero)) {
                    $scope.callBlack.mostrarMsgErro = true;
                    $scope.showMsg('E', "necessario-informar-campos-obrigatorios");
                }else{
                    if($scope.configuracao.callBlacklist==null){
                        $scope.configuracao.callBlacklist=[];
                    }
                    if(_.find($scope.configuracao.callBlacklist,function (item) {
                            return item.numero==$scope.callBlack.numero;
                        })==null) {
                        $scope.configuracao.callBlacklist.push({numero:$scope.callBlack.numero});
                        $scope.callBlack = {};
                    }else{
                        $scope.callBlack.mostrarMsgErro = true;
                        $scope.showMsg('E', "numero-ja-adicionado");
                    }
                }
            }
        }]);

    return app;
})
;