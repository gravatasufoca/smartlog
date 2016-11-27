/*! ms-breadcrumb - v1.0.0 - 2014-01-16
* Inspired in https://github.com/ncuillery/angular-breadcrumb
* Andrey Moretti
* */

define([
        'componentes/ms-breadcrumb/services/msBreadcrumbProvider',
        ], 
		function(msBreadcrumb) {
		
		'use strict';
		
		msBreadcrumb.directive('msBreadcrumb', ['$state', '$breadcrumb', '$compile', '$location', function($state, $breadcrumb, $compile, $location) {
	        return function(scope, element) {
	        	try {
		            scope.$watch(function() { return $state.current; }, function() {
		                var chain = $breadcrumb.getStatesChain();
		               
		                var stateNames = [];
		                angular.forEach(chain, function(value) {
		                    if(value.breadcrumb) {
		                        stateNames.push({
		                        	route: value.name,
		                        	name: value.breadcrumb
		                        });
		                    } else {
		                        stateNames.push({
		                        	route: value.name,
		                        	name: value.name
		                        });
		                    }
		                });
		                
		                /*
		                 * Alterado para funcionar com bootstrap
		                 */
		                scope.stateNames = stateNames;
		                
		                scope.path = $location.path().replace('/', '');
		                scope.currentState = $state.current.name;
		                
                                scope.reloadFromBreadcrumb = function(state) {
                                    $state.go(state, {}, {reload:true});
                                }

		                var template = angular.element(
		                		'<div class="row">' +
			                        '<div class="span12">' +
				                        '<ul class="breadcrumb">' +
				                          	'<li ng-repeat="breadcrumb in stateNames" ui-sref-active="active">' +
				                          		'<a ng-if="currentState != breadcrumb.route" ng-click="reloadFromBreadcrumb(breadcrumb.route)">{{ breadcrumb.name }}</a> <span ng-if="currentState != breadcrumb.route" class="icone-arrow-right"></span>'  +
				                          		'<span ng-if="currentState == breadcrumb.route">{{ breadcrumb.name }}</span>'  +
				                        	'</li>' +
				                        '</ul>' +
			                        '</div>' +
		                      	'</div>');
		                
		                $compile(template)(scope);
		                element.html(null).append( template );
		                
		            }, true);
	        	}
	        	catch(e) {
	        		scope.$msNotify.error(e);
	        	}
	        };
		}]);
		
		return msBreadcrumb;
		
});

