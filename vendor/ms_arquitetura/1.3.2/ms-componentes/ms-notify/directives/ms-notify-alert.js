/*! ms-breadcrumb - v1.0.0 - 2014-01-16
* Inspired in https://github.com/ncuillery/angular-breadcrumb
* Andrey Moretti
* */

define([
        'componentes/ms-breadcrumb/services/breadCrumbProvider',
        ], 
		function(msBreadCrumb) {
		
		'use strict';
		
		msBreadCrumb.directive('msBreadcrumb', ['$state', '$breadcrumb', '$compile', '$location', function($state, $breadcrumb, $compile, $location) {
	        return function(scope, element) {
	        	
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
	             
	                var template = angular.element(
	                		'<div class="row">' +
		                        '<div class="span12">' +
			                        '<ul class="breadcrumb">' +
			                          	'<li ng-repeat="breadcrumb in stateNames" ng-class="{\'active\': breadcrumb.route == path }">' +
			                          		'<a ng-if="breadcrumb.route != path" ui-sref="{{ breadcrumb.route }}" ng-href="#/{{ breadcrumb.route }}">{{ breadcrumb.name }}</a> <span ng-if="breadcrumb.route != path" class="icone-arrow-right"></span>'  +
			                          		'<span ng-if="breadcrumb.route == path">{{ breadcrumb.name }}</span>'  +
			                        	'</li>' +
			                        '</ul>' +
		                        '</div>' +
	                      	'</div>');
	                
	                $compile(template)(scope);
	                element.html(null).append( template );
	                
	            }, true);
	        };
		}]);
		
		return msBreadCrumb;
		
});

