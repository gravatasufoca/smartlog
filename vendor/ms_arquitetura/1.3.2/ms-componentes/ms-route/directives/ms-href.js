/*! 
* Andrey Moretti
* DIRETIVA AINDA NÃO FINALIZADA!
* */

define([
        'componentes/ms-route/msRoute',
        ], 
		function(msRoute) {
		
		'use strict';
		
		msRoute.directive('msHref', ['$state',
                     function($state){
                         
                        return {
                            restrict: 'A', //Attribute
                            //require: '?ngModel',
                            scope: true,
//                            scope:{
//                                'resolveData' : '=',
//                                'target': '='
//                            },
                            link: function (scope, element, attrs, ctrl)
                            {
                                try {
                                    //scope.$watch()
                                    var res = attrs.msHref.split('/');
                                    
                                    scope.$watch( attrs.menuData, function(val)
			            {                                        
			                var template = angular.element(
			                		'<ul class="nav">' +
			                			'<li ng-repeat="node in ' + attrs.menuData + '" ng-class="{active:node.active && node.active==true, \'has-dropdown\': !!node.children && node.children.length}">' +
			                				'<a ng-if="!node.children" ui-sref="{{node.route}}" ng-href="#/{{node.href}}"" >{{node.name}}</a>' + 
			                				'<ms-sub-nav-menu></ms-sub-nav-menu>' +
		                				'</li>' +
	                				'</ul>');
                                                
			                $compile(template)(scope);
			                element.html(null).append( template );
	
			            }, true );
                                    
                                    msRoute.config(['$stateProvider', '$urlRouterProvider', '$breadcrumbProvider', 
                                                function($stateProvider,  $urlRouterProvider, $breadcrumbProvider){
                                                    $stateProvider.state('route', {
                                                            url: '/route',
                                                            templateUrl: "app/pages/home/views/page.tpl.html" ,
                                                            //resolve: app.resolve(['home/home']),
                                                            breadcrumb: 'route'
                                                        });
                                                }]);
                                    
                                    $state.go('route');
                                    console.log($state);
                                    //element.attr('ui-sref', 'teste');
                                }
                                catch(e) {
                                    scope.$msNotify.error(e);
                                }
                            }
                        };
		}]);
		
		return msRoute;
		
});

