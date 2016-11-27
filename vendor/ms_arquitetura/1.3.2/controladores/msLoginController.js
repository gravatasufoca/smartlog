define([
        'msControllers/msAppController',
        'componentes/ms-seguranca/services/msAutenticacaoService',
        ], 
        function(msAppController) {
            'use strict';
            try {
                
                msAppController.controller('msLoginController',  ['$scope', '$state', '$resource', 'msSegurancaService', 'msAutenticacaoService', '$rootScope', '$window', '$timeout',
                    function($scope, $state, $resource, msSegurancaService, msAutenticacaoService, $rootScope, $window, $timeout) {                        
                        
                        $scope.formLogin = {
                            email: '',
                            password: ''
                        };
                        
                        $scope.login = function() {
                            try {
                                
                                if(!appConfig.login) {
                                    throw 'Não foi informada uma configuração de login para a aplicação. Vide appConfig(main.js)';
                                }

                               if($scope.msLoginForm.$valid) {
                                    msAutenticacaoService.autenticar($scope.formLogin.email, $scope.formLogin.password).then(function(result) {
                                            msAutenticacaoService.recuperarDadosUsuario().then(function(result) {
                                                $timeout(function() {
                                                    $rootScope.usuarioAutenticado = result;
                                                    $rootScope.$apply();
                                                    $state.go(appConfig.login.sucesso);
                                                });
                                            });
                                        
                                    }, function(reason) {
                                        $scope.$msAlert.error(reason);
                                    }) ;
                                }
                                else {                                    
                                    throw 'Os dados informados não conferem';
                                }
                            }
                            catch(e) {
                                $scope.$msAlert.error(e, true);
                            }
                        };

                        $scope.logout = function() {
                            try {
                                msAutenticacaoService.sair().then(function(result) {
                                    $state.go('login');
                                });
                            }
                            catch(e) {
                                $scope.$msNotify.error(e);
                            }
                        };
                    
                }]);
            }
            catch(e) {
                    $log.error(e);
            }
            
            return msAppController;
			
});