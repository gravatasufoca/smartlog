define(['msAppJs'
], function(app) {
	'use strict';

	app.directive('exNomeAparelho', ["$rootScope","configuracoesService", function($rootScope,configuracoesService) {
		function link(scope, elm, attrs) {

            scope.id = Math.random().toString(36).substring(10);
			scope.perfil={};

			/**
			 * Binda evento blur
			 */
			scope.blur = function() {
				if(scope.perfil.nome!=null){
					configuracoesService.alterarNome(scope.perfil);
                    $("#label"+scope.id).show();
                    $("#span"+scope.id).hide();
                }
			};

			scope.clicar=function () {
				$("#label"+scope.id).hide();
				$("#span"+scope.id).show();
            }

            scope.$watch("$root.usuarioAutenticado",function () {
				if($rootScope.usuarioAutenticado!=null){
					scope.perfil=$rootScope.usuarioAutenticado.perfil;
				}
            })
		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			template: function(element, attrs) {
				var template =  '<div><label id="label{{id}}" ng-click="clicar()"><strong>{{perfil.nome}}</strong></label>' +
					'<span id="span{{id}}" style="display:none"><input id="valor{{id}}" ng-maxlength="45" type="text" ng-model="perfil.nome" ng-blur="blur()" /> </span></div>';
				return template;
			},
			scope: {
			}
		};
	}]);


	return app;
});