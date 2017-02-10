define([
        'msControllers/msController',
//        'msControllers/msLoginController',
        'componentes/ms-menu/directives/ms-nav-menu',
        'componentes/ms-breadcrumb/directives/ms-breadcrumb',
        'componentes/ms-seguranca/services/msAutenticacaoService',
        'componentes/ms-seguranca/directives/ms-contador',
//        'componentes/ms-seguranca/directives/ms-usuario-info',
        'componentes/ms-seguranca/directives/ms-seguranca',
//        'componentes/ms-grid/msGrid',
        'angularNgTable',
        'componentes/ms-modal/msModal',
        'componentes/ms-notify/services/msNotifyService',
        'componentes/ms-notify/services/msAlertService',
        'componentes/ms-route/services/msRouteService',
        'componentes/ms-notify/directives/ms-alert',
        'componentes/ms-spinner/directives/ms-loading-spinner',
        'angularTimer',
        'angularResource',
        'angularTranslate',
        'angularTranslatePartialLoader',
		'angularMaps',
        'componentes/ms-utils/filters/msRemoverAcentuacao',
        'componentes/ms-utils/filters/msHifenizar',
        'componentes/ms-utils/services/msUtilsUnderscoreService',
        'componentes/ms-utils/services/msPropriedadesService',
//        'componentes/ms-utils/directives/ms-identificador-ambiente',
        'componentes/ms-utils/directives/ms-compile',
        'componentes/ms-validator/msValidator',
        'restangular'
        ],
        function() {
	'use strict';

	/*
	 * Create the module
	 */
	var app =  angular.module('msApp', [
	                                    'msAppController',
	                                    'msModal',
//	                                    'msGrid',
	                                    'ngTable',
	                                    'msMenu',
	                                    'msBreadcrumb',
	                                    'msNotify',
	                                    'msSpinner',
	                                    'msSeguranca',
	                                    'timer',
	                                    'ngResource',
	                                    'ui.utils',
	                                    'pascalprecht.translate',
	                                    'msUtils',
	                                    'msValidator',
	                                    'restangular','ngMap']);

	//var requireConfig = requirejs.s.contexts._.config;
	var appBaseUrl = (typeof appConfig.appBaseUrl != "undefined") ? appConfig.appBaseUrl : 'app';

	app.run(function ($rootScope, $translate, msRouteService) {
		$rootScope.$on('$translatePartialLoaderStructureChanged', function () {
            $translate.refresh();
        });

		app.msRouteService = msRouteService;
	});

	/*
	 * Configurando LazyLoading e translate
	 */
	app.config(['$controllerProvider', '$provide', '$compileProvider', '$translateProvider', '$filterProvider',
	            function($controllerProvider, $provide, $compileProvider, $translateProvider, $filterProvider){

		app._controller = app.controller;
		app._service = app.service;
		app._directive = app.directive;
		app._filter = app.filter;
		app._factory = app.factory;
		app._provider = app.provider;
		app._value = app.value;

		app.controller = function( name, constructor ) {
			$controllerProvider.register( name, constructor );
			return( this );

		};

		app.service = function( name, constructor ) {
			$provide.service( name, constructor );
			return( this );

		};

		app.factory = function( name, constructor ) {
			$provide.factory( name, constructor );
			return( this );

		};

		app.directive = function( name, constructor ) {
			$compileProvider.directive( name, constructor );
			return( this );

		};

		app.filter = function( name, constructor ) {
			$filterProvider.register( name, constructor );
			return( this );

		};

		app.value = function( name, value ) {
			$provide.value( name, value );
			return( this );
		};

		/*
		 * Translate
		 */

		var bust = (new Date()).getTime();
		$translateProvider.useLoader('$translatePartialLoader', {
			urlTemplate: appBaseUrl + '/pages/{part}/nls/{lang}.json?bust=' + bust
		});

		$translateProvider.preferredLanguage('pt_BR');
	}]);


	/*
	 * Configurando o HTTP INTERCEPTOR e as ROTAS
	 */
	app.config(['$httpProvider','$stateProvider', '$provide', 'RestangularProvider',
	            function($httpProvider, $stateProvider, $provide, RestangularProvider){

		RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});

		$provide.factory('msHttpInterceptor', ['$q', '$injector', '$rootScope', function($q, $injector, $rootScope) {
			var $http, notificationChannel;
			return {
				'request': function(config) {
					notificationChannel = notificationChannel || $injector.get('msRequestSpinner');
					notificationChannel.requestStarted();
					return config || $q.when(config);
				},
				'requestError': function(rejection) {
					return $q.reject(rejection);
				},
				'response': function(response) {
					$http = $http || $injector.get('$http');
					if ($http.pendingRequests.length < 1) {
						notificationChannel = notificationChannel || $injector.get('msRequestSpinner');
						notificationChannel.requestEnded();
					}
					return response || $q.when(response);
				},
				'responseError': function(rejection) {
					$http = $http || $injector.get('$http');
					if ($http.pendingRequests.length < 1) {
						notificationChannel = notificationChannel || $injector.get('msRequestSpinner');
						notificationChannel.requestEnded();
					}

					//custom messages
					if(rejection.data!=null && rejection.data.mensagens!=null &&rejection.data.mensagens.length>0){
						rejection=rejection.data.mensagens;
                        return $q.reject(rejection);
                    }

					/*
					 * 404 Interceptor para content text/HTML
					 * Outros contents devem ser tratados pela aplicação
					 */
					if(rejection.status == 404 && rejection.headers('Content-Type').match('text/html')) {
						rejection = (typeof appConfig.erros != "undefined" && typeof appConfig.erros._404_ != "undefined") ? appConfig.erros._404_ : 'O recurso ' + rejection.config.url + ' não foi encontrado.';
					}

					/*
					 * 500 Interceptor
					 */
					if(rejection.status == 500) {
						rejection = (typeof appConfig.erros != "undefined" && typeof appConfig.erros._500_ != "undefined") ? appConfig.erros._500_ : 'Ocorreu um erro no servidor.';
					}

					/*
					 * 401 Interceptor
					 */
					if(rejection.status == 401) {
						$rootScope.$broadcast('destuirSessao');
						rejection = (typeof appConfig.erros != "undefined" && typeof appConfig.erros._401_ != "undefined") ? appConfig.erros._401_ : 'Você não está autorizado a acessar essa página.';
					}

					/*
					 * 403 Interceptor
					 */
					if(rejection.status == 403) {
						rejection = (typeof appConfig.erros != "undefined" && typeof appConfig.erros._403_ != "undefined") ? appConfig.erros._403_ : 'Proibido.';
					}

					return $q.reject(rejection);
				}
			};
		}]);

		$httpProvider.interceptors.push('msHttpInterceptor');
	}]);

	return app;

}
);
