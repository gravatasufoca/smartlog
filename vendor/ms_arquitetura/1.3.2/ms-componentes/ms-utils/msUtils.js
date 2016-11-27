define([
        'angularUiUtils',
        'jQueryRvFontsize',
        'utils/contraste',
        'utils/functions',
        ], 
		function() {
			'use strict';
			try {
				var msUtils =  angular.module('msUtils', [
                                    'ui.utils'
                                ]);
                                
                                /*
                                 * Configurando o modulo para permitir LazyLoading de providers
                                 */
                                msUtils.config(['$controllerProvider', '$provide', '$compileProvider',
                                                    function($controllerProvider, $provide, $compileProvider){

                                        msUtils.directive = function( name, constructor ) {
                                            $compileProvider.directive( name, constructor );
                                            return( this );

                                        };      

                                        msUtils.factory = function( name, constructor ) {
                                            $provide.factory( name, constructor );
                                            return( this );

                                        };
                                }]);
                            
                            
                                msUtils.run(['$rootScope', 'msPropriedadesService', function($rootScope, msPropriedadesService) {
                                        $rootScope.msPropriedades = msPropriedadesService.get();
                                }]);
                                
                                return msUtils;
                                
			}
			catch(e) {
				$log.error(e);
			}
			
});
   