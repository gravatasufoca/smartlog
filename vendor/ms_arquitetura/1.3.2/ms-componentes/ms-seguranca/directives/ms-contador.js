define([
        'componentes/ms-seguranca/services/msSegurancaService',
        ], 
        function(msSeguranca) {

	'use strict';

	msSeguranca.directive('msContador', ['msSegurancaService', '$compile', function(msSegurancaService, $compile) {

		return {
			restrict: 'E',
			link: function(scope, element, attrs, ctrl) {
				try {
					scope.$watch(attrs.limite, function(content) {
						var template = angular.element('<timer end-time="limite">{{minutes}}:{{seconds}}</timer>');
						element.html( template );
						$compile(element.contents())(scope);
					});

				}
				catch(e) {
					scope.$msNotify.error(e);
				}
			}
		};
	}]);

	return msSeguranca;

});

