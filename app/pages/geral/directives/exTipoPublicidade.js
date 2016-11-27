define(['msAppJs'], function(app) {
	'use strict';

	app.directive('exTipoPublicidade', ["apoioService", function(apoioService) {

		function link(scope, element, a) {
			/**
			 * Verifica se o uf deve estar desativado, futuramente mais validacoes
			 */
			scope.disabled = function() {
				if(scope.desativado){
					return true;
				}
			};


			/**
			 * Carrega a Lista aprovacao 
			 */
			apoioService.tiposPublicidadeList()
			.then(function(data) {
				scope.tiposPublicidadeList = data.resultado;
			});

			
			/**
			 * Quando o valor mudar, chamar a funcao de callback se for necessario.
			 */
			scope.tipoPublicacaoChange = function() {
				if (scope.onTipoPublicidadeChangeFn) {
					scope.onTipoPublicidadeChangeFn(scope.valor);
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
					'	<label for="'+id+'">{{rotulo | translate}} <em class="form-req">{{obrigatorio ? "*" : ""}}</em></label> '+
					'	<select id="'+id+'" class="form-control" '+
					'		ng-change="tipoPublicacaoChange()" '+
					'		ng-disabled="disabled()" '+
					'		ng-model="valor" '+
					'		ng-options="ta as ta.descricao for ta in tiposPublicidadeList track by ta.id" '+
					'		ng-required="obrigatorio"> '+
					'		<option value="">{{obrigatorio ? "selecione" : "todos" | translate}}</option> '+
					'	</select> '+
					'	<ex-obrigatorio mostrar-quando="mostraMsgErro()"></ex-obrigatorio> '+
					'</div> ';
				return template;
			},
			scope: {
				rotulo: "=",
				tamanhoSpan: "=",
				desativado: "=",
				msgErroQuando: "=",
				valor: "=",
				obrigatorio: "=",
				onTipoPublicidadeChangeFn : "="
			}
		};
	}]);

	return app;
});