define([
        'componentes/ms-route/services/msRouteService',
        ], 
        function(msRoute) {
	'use strict';
	try {
		var msMenu = angular.module('msMenu', ['msRoute']);

		/*
		 * Configurando o modulo para permitir LazyLoading de providers
		 */
		msMenu.config(['$controllerProvider', '$provide', '$compileProvider',
		               function($controllerProvider, $provide, $compileProvider){

			msMenu.directive = function( name, constructor ) {
				$compileProvider.directive( name, constructor );
				return( this );

			};      

			msMenu.service = function( name, constructor ) {
				$provide.service( name, constructor );
				return( this );

			};
		}]);

		return msMenu;
	}
	catch(e) {
		//$log.error(e);
	}

});
