define(['componentes/ms-route/msRoute'], 
		function(msRoute) {

	'use strict';

	msRoute.factory('msRouteService', [ '$log', 
	                                    '$http', 
	                                    '$q',
	                                    function($log, 
	                                    		$http, 
	                                    		$q){

		'use strict';

		var appBaseUrl = (typeof appConfig.appBaseUrl != "undefined") ? appConfig.appBaseUrl : 'app';

		var setState = function(content) {
			
			angular.forEach(content, function(object, key) {
				try{
					if(object.children) {
						setState(object.children);
					}

					if(object.inner) {
						setState(object.inner);
					}


					
					var wordsControl = (object.module) ? object.module.split('-') : new Array();
					var secondName = '';
					if(wordsControl.length > 1) {
						for (var i=1;i<wordsControl.length;i++) { 
							secondName += wordsControl[i].charAt(0).toUpperCase() + wordsControl[i].slice(1);
						}
					}
					var control = (wordsControl.length) ? wordsControl[0].toLowerCase() + secondName + 'Controller' : null;
					
					
					var tpl = object.view;
					var state;
					var url;
					
					
					if(object.state) {
						if(object.state.url) {
							url = object.state.url;
						}
						if(object.state.name) {
							state = object.state.name;
						}
					} else {
						if(object.menuUrl)
							url = state = retira_acentos(object.menuUrl).toLowerCase().replace(/\s/g, "-");
						else
							url = state = retira_acentos(object.text).toLowerCase().replace(/\s/g, "-");
					}

					var bootstrapJs = (object.resolve) ? object.resolve : object.module;

					msRoute.$stateProvider
					.state(state, {
						url: "/" + url ,
						templateUrl: appBaseUrl + '/pages/' + object.module + '/views/' + tpl + '.tpl.html',
						resolve: resolve(['pages/' + object.module + '/' + bootstrapJs]),
						controller: (object.controller) ? object.controller : control ,
								breadcrumb: object.breadcrumb ? object.breadcrumb : object.text,
										roles: object.roles ? object.roles : false
												,onEnter: (object.onEnter) ? object.onEnter() : function(){}
					});
				}
				catch(e) {
					$log.error(e);
				}
			});
		}

		var create = function(content) {

			var deferred = $q.defer();

			var defaultRoute = (typeof appConfig.defaultRoute != "undefined") ? appConfig.defaultRoute : 'home';
			msRoute.$urlRouterProvider.otherwise(defaultRoute);

			if(typeof content == 'string') {
				$http.get(content).then(function(success) {
					setState(success.data);
					deferred.resolve(success.data);
				}, function(reason){
					$log.error('Erro na criação de rotas: ' + reason);
				});
			}
			else {
				setState(content);
				deferred.resolve(content);
			}

			return deferred.promise;
		}

		return {
			create: create
		};
	}]);

	return msRoute;

});