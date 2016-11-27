define(['msAppJs'], function(app) {
	'use strict';

	app.directive('exTema', ["apoioService", function(apoioService) {

		function link(scope, element, a) {
			/**
			 * Verifica se o tema deve estar desativado
			 */
			scope.disabled = function() {
				if(scope.desativado){
					return true;
				}
			};


			/**
			 * Carrega a Lista aprovacao 
			 */
			apoioService.listarTemas()
			.then(function(data) {
				scope.temasList = data.resultado;
			});


			/**
			 * Quando o valor mudar, chamar a funcao de callback se for necessario.
			 */
			scope.temaChange = function() {
				if (scope.onTemaChangeFn) {
					scope.onTemaChangeFn(scope.valor);
				}
			};


			/**
			 * Verifica se é necessario mostrar a msg de erro
			 */
			scope.mostraMsgErro = function() {
				if(scope.obrigatorio && scope.msgErroQuando) {
					return true;
				} else {
					return false;
				}
			};

		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			template: function(element, a) { 
				var id = Math.random().toString(36).substring(10);
				var template = 
					'<div class="{{tamanhoSpan}}"> '+
					'	<label for="'+id+'">{{\'tema\' | translate}} <em class="form-req">{{obrigatorio ? "*" : ""}}</em></label> '+
					'	<select id="'+id+'" class="form-control" '+
					'		ng-change="temaChange()" '+
					'		ng-disabled="disabled()" '+
					'		ng-model="valor" '+
					'		ng-options="ta as ta.nome for ta in temasList track by ta.id" '+
					'		ng-required="obrigatorio"> '+
					'		<option value="">{{obrigatorio ? "selecione" : "todos" | translate}}</option> '+
					'	</select> '+
					'	<ex-obrigatorio mostrar-quando="mostraMsgErro()"></ex-obrigatorio> '+
					'</div> ';
				return template;
			},
			scope: {
				tamanhoSpan: "=",
				desativado: "=",
				msgErroQuando: "=",
				valor: "=",
				obrigatorio: "=",
				onTemaChangeFn : "="
			}
		};
	}]);

	return app;
});