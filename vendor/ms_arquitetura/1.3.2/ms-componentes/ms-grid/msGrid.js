define([
        'angularNgTable',
        ], 
		function() {
		'use strict';
		var msGrid =  angular.module('msGrid', ['ngTable']);
                
                /*
                 * Configurando o modulo para permitir LazyLoading de providers
                 */
                msGrid.config(['$controllerProvider', '$provide', '$compileProvider',
			            function($controllerProvider, $provide, $compileProvider){
                             
                        msGrid.directive = function( name, constructor ) {
                            $compileProvider.directive( name, constructor );
                            return( this );

                        };      
                        
                        msGrid.service = function( name, constructor ) {
                            $provide.service( name, constructor );
                            return( this );

                        };
                }]);
            
                return msGrid;
});
   