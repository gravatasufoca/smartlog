/*! ms-loading-spinner - v1.0.0 - 2014-01-16
* Andrey Moretti
* */

define([
        'componentes/ms-spinner/services/msRequestSpinner',
        ], 
		function(msSpinner) {
		
		'use strict';
		
		msSpinner.directive('msLoadingSpinner', ['msRequestSpinner', function (msRequestSpinner) {
                    return {
                        restrict: "EA",
                        link: function (scope, element, attrs) {
                            
                            var loadingContent = angular.element('<div class="loading-content"></div>');
                            var loadingLayer = angular.element('<div class="loading"></div>');
                            element.append(loadingLayer);
                            
                            if(attrs.loaderContent) {
                                loadingLayer.append(loadingContent);
                            }
                            
                            element.addClass('loading-container');
                            scope.$watch(attrs.loader, function(value) {
                                loadingLayer.toggleClass('ng-hide', !value);
                            });
                        }
                    };
                }]);
		
		return msSpinner;
		
});

