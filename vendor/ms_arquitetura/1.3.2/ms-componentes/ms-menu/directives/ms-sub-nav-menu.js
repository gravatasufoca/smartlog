define(['componentes/ms-menu/msMenu'], 
        function(msMenu) {

	'use strict';

	msMenu.directive('msSubNavMenu', ['$compile', 
	                                  function($compile) {

		return {
			restrict: 'E', //Element
			scope:true,
			link: function (scope, element, attrs) {
				try {
					scope.tree = scope.node;

					if(scope.tree.children && scope.tree.children.length ) {
						var template = angular.element(
								'<a data-toggle="dropdown" class="dropdown-toggle">{{ tree.text }}<b class="caret"></b></a>' +
								'<ul class="dropdown-menu" role="menu" aria-lablelledby="dropdownMenu">' + 
								'<li ng-repeat="node in tree.children" node-id={{node.' + attrs.nodeId + '}} ms-seguranca roles="node.roles"  ng-class="{active:node.active && node.active==true, \'has-dropdown\': !!node.children && node.children.length}">' + 

								'<a ng-if="!node.children" ng-click="reloadState((node.state && node.state.goTo) ? node.state.goTo : ((node.menuUrl ? node.menuUrl : node.text) | msRemoverAcentuacao | msHifenizar))" ng-bind-html="node.text"></a>' + 
								'<ms-sub-nav-menu tree="node" ms-seguranca roles="node.roles" ></ms-sub-nav-menu>' +
								'</li>' +
						'</ul>');

						$compile(template)(scope);
						element.html(null).append( template );
					} else {
						element.remove();
					}
				} catch(e) {
					scope.$msNotify.error(e);
				}
			}
		};
	}]);

	return msMenu;
});