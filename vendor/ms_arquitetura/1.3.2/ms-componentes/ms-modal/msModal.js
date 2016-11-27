define([
        'angularUiBootstrap',
        'angularSanitize'
        ], 
		function() {
			'use strict';
			try {
				var msModal =  angular.module('msModal', ['ui.bootstrap', 'ngSanitize']);
                                
                                /*
                                 * Configurando o modulo para permitir LazyLoading de providers
                                 */
                                msModal.config(['$controllerProvider', '$provide', '$compileProvider',
                                                    function($controllerProvider, $provide, $compileProvider){

                                        msModal.directive = function( name, constructor ) {
                                            $compileProvider.directive( name, constructor );
                                            return( this );

                                        };      

                                        msModal.service = function( name, constructor ) {
                                            $provide.service( name, constructor );
                                            return( this );

                                        };
                                }]);
                                
                                return msModal;
			}
			catch(e) {
				$log.error(e);
			}
});
   