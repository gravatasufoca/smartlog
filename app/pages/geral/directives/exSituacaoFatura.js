define(['msAppJs'], function(app) {
	'use strict';

	app.directive('exSituacaoFatura', ["apoioService", function(apoioService) {

		function link(scope, element, a) {
			/**
			 * Verifica se o uf deve estar desativado, futuramente mais validacoes
			 */
			scope.disabled = function() {
				if(scope.desativado){
					return true;
				}
			};

			if(scope.apenasMemorando) {
				apoioService.situacoesFaturaMemorandoList()
				.then(function(data) {
					scope.situacoesFaturaList = data.resultado;
				});
			} else {
				apoioService.situacoesFaturaList()
				.then(function(data) {
					scope.situacoesFaturaList = data.resultado;
				});
			}


			scope.situacaoFaturaChange = function() {
				if (scope.onSituacaoFaturaChangeFn) {
					scope.onSituacaoFaturaChangeFn(scope.valor);
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
					'		ng-change="situacaoFaturaChange()" '+
					'		ng-disabled="disabled()" '+
					'		ng-model="valor" '+
					'		ng-options="sf as sf.descricao for sf in situacoesFaturaList track by sf.id" '+
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
				onSituacaoFaturaChangeFn : "=",
				apenasMemorando : "="
			}
		};
	}]);

	return app;
});