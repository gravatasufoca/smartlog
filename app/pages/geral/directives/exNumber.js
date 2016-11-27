define(['msAppJs'], function(app) {
	'use strict';

	/**
	 * Apenas Números
	 */
	app.directive('exNumber', function () {
		return {
			restrict: 'C',
			require: 'ngModel',
			link: function (scope, element, attrs, ngModel) {   
				scope.$watch(attrs.ngModel, function(newValue, oldValue, a) {
					if (newValue && newValue != null) {
						newValue = newValue+"";
						if(!isNaN(newValue.extractNumbers())) {
							ngModel.$setViewValue(newValue.extractNumbers());
							ngModel.$render();
						}
					}
				});
			}
		};
	});

	return app;
});