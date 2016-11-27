define([
        'angularUiRouter',
        'componentes/ms-notify/services/msAlertService'
        ], 
        function() {
            'use strict';
                
            var msRoute = angular.module('msRoute', ['ui.router']);
            
            msRoute.run(['$rootScope', '$state', '$msAlertService', function($rootScope, $state, $msAlertService){
                    $rootScope.reloadState = function(state) {
                        $state.go(state, {}, {reload:true});
                    };
                    
                    /*
                     * Forçando o reload do state, para recarregar o controller e os resolves
                     */
                    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                        $state.reload();
                        $msAlertService.clear();
                        $rootScope.$msNotify.close();
                    });
                    
                    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                        
                        $rootScope.$msNotify.loading();
                    });
                    
            }]);
        
            /**
             * Atribuindo o provider de rotas ao modulo, para configurações on the fly
             */
            msRoute.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
                  msRoute.$stateProvider = $stateProvider;  
                  msRoute.$urlRouterProvider = $urlRouterProvider;
            }]);
        
            msRoute.createRoute = function(routes) {
                try{
                    var elem = angular.element('body');
                    var injector = elem.injector();
                    var myService = injector.get('msRouteService');
                    myService.create(routes);
                    elem.scope().$apply();
                }
                catch(e) {
                    console.log(e);
                }
            }
                
        return msRoute;
                
});