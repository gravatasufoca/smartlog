define([
        'msControllers/msAppController'
        ], 
        function(msAppController) {
            'use strict';
            try {
                
                msAppController.controller('msController',  ['$rootScope', '$scope', 'msAutenticacaoService', '$timeout', 'msRouteService', '$state',
                    function($rootScope, $scope, msAutenticacaoService, $timeout, msRouteService, $state) {
		
                    $scope.app = appConfig;
                    
                    $scope.edit = function() {
                        $scope.$msNotify.info('Editando');
                    };
                    
                    $scope.remove = function(url) {
                        $scope.$msNotify.error('Remoção');
                    };
                    
                    $scope.view = function() {
                        $scope.$msNotify.error('Visualizando');
                    };
                    
                    
                    /**
                     * Controlador de MENU.
                     * Escopo GLOBAL da aplicação.
                     */
                    $scope.menu = [];
                    
                    $scope.alterarMenu = function(data) {
                        if(data)
                            $scope.menu = data;
                    };
                    
                    var loginModule = (typeof appConfig.login != 'undefined' && typeof appConfig.login.module != 'undefined') ? appConfig.login.module : 'login';
                    
                    var loginRoutes = [{
                        module: loginModule,
                        view: 'login',
                        resolve: 'login',
                        controller: 'loginController',
                        text: 'Login'
                    },
                    {
                        module: loginModule,
                        text: 'logout',
                        resolve: 'login',
                        controller: 'loginController',
                        view: 'login'
                    }];
                    
                    msRouteService.create(loginRoutes);
                    
                    /*
                     * Recuperando as informações do usuário em caso de atualização da pagina
                     * 
                     */
                    msAutenticacaoService.recuperarDadosUsuario().then(function(result) {
                        $timeout(function() {
                            $rootScope.usuarioAutenticado = result;
                            $rootScope.$apply();
                        });
                    });
                    
                    
                    /*
                     * Edição de usuário logado
                     */
                    $scope.editUsuario = function() {
                    }


                }]);
            }
            catch(e) {
                    $log.error(e);
            }
            
            return msAppController;
			
});