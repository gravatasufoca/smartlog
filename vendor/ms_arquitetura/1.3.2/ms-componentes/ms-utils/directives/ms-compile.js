define([
        'componentes/ms-utils/msUtils',
        ], 
        function(msUtils) {
            'use strict';
            
            /*
             * Diretiva de compilação para ng-html-bind, quando 
             */
            msUtils.directive('msCompile', function($compile) {

                return function(scope, element, attrs) {
                  scope.$watch(
                    function(scope) {
                      return scope.$eval(attrs.msCompile);
                    },
                    function(value) {
                      element.html(value);
                      $compile(element.contents())(scope);
                    }
                  );
                };
              });
            
            return msUtils;
			
});