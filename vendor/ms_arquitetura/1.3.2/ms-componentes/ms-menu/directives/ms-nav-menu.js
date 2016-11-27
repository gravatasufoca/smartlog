define([
        'componentes/ms-menu/directives/ms-sub-nav-menu',
        ], 
        function(msMenu) {

	'use strict';

	msMenu.directive('msNavMenu', ['$compile', 
	                               'msRouteService', 
	                               '$http', 
	                               '$parse',
	                               function($compile, 
	                            		   msRouteService, 
	                            		   $http, 
	                            		   $parse) {

		return {
			restrict: 'E', //Element
			scope:true,
			link: function (scope, element, attrs) { 
				try {
					scope.$watch(attrs.menuData, function(val)	{ 
						msRouteService.create(val)
						.then(function(result) {
							var menuData = 'menuData';
							$parse(menuData).assign(scope, result);
							var template = angular.element(
									'<ul class="nav">' +
									'<li ng-repeat="node in ' + menuData + '" ms-seguranca roles="node.roles" ng-class="{active:node.active && node.active==true, \'has-dropdown\': !!node.children && node.children.length}">' +
									'<a ng-if="!node.children" ng-click="reloadState((node.state && node.state.url) ? node.state.url : ((node.menuUrl ? node.menuUrl : node.text) | msRemoverAcentuacao | msHifenizar))" ng-bind-html="node.text"></a>' + 
									'<ms-sub-nav-menu></ms-sub-nav-menu>' +
									'</li>' +
							'</ul>');

							$compile(template)(scope);
							element.html(null).append( template );
						}, function(reason) {
							scope.$msAlert.error('Não foi possível renderizar o menu.');
						});
					}, true );

				} catch(e) {
					scope.$msNotify.error(e);
				}
			}
		};
	}]);

	return msMenu;


});