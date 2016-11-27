define([
        'angularNgCookies',
        ], 
		function() {
			'use strict';
			try {
                            
                            var msSeguranca =  angular.module('msSeguranca', ['ngCookies']);
                            
                            msSeguranca.run(['$rootScope', 'msSegurancaService', '$state', 'msAutenticacaoService',
                                function($rootScope, msSegurancaService, $state, msAutenticacaoService) {
                                    
                                    /*
                                     * Limpando a sessao do usuario quando o tempo expirar
                                     */
                                    $rootScope.$on('timer-stopped', function (event, data){
                                        if(msSegurancaService.isUsuarioAutenticado()) {
                                            msAutenticacaoService.sair().then(function(result) {
                                                $state.go('login');
                                            	$rootScope.showMsg('I', 'Seu tempo de sess\u00e3o expirou');
                                            });
                                        }
                                    });
                                    
                                    /*
                                     * Atualizando informações nas mudanças de rota
                                     */
                                    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                                        //Limpando os alertas visiveis:
                                        $rootScope.alerts = [];
                                        
                                        $rootScope.isUsuarioAutenticado = msSegurancaService.isUsuarioAutenticado();
                                        
                                        var defaultState = (appConfig.defaultRoute) ? appConfig.defaultRoute : 'home';
                                       
                                        if(msSegurancaService.isUsuarioAutenticado()) {
                                            
                                            $rootScope.limite = msSegurancaService.contador();
                                            $rootScope.$on('UsuarioAutenticado', function(event, data) {
                                                $rootScope.usuarioAutenticado = data;
                                            });
                                            
                                            if(toState.name == 'login') {
                                                event.preventDefault();
                                                $state.go(appConfig.login.sucesso);
                                                $rootScope.$msNotify.close();
                                            }
                                            else {
                                                msSegurancaService.possuiAcesso(toState.roles).then(function(result) {

                                                }, function(reason) {
                                                    event.preventDefault();
                                                    $rootScope.$msAlert.info(reason);
                                                    $state.go(defaultState);
                                                    $rootScope.$msNotify.close();
                                                });
                                            }
                                        }
                                        else {
                                            if(toState.roles) {
                                            	$rootScope.showMsg('W', '\u00c9 necess\u00e1rio estar logado para acessar essa funcionalidade.');
                                                event.preventDefault();
                                                $state.go('login');
                                                $rootScope.$msNotify.close();
                                            }
                                        }
                                    
                                    });
                            }]);
                        
                        
                            return msSeguranca;
                                
			}
			catch(e) {
				$log.error(e);
			}
		
});
   