define(['msAppJs',
        'pages/fornecedor/services/fornecedorService'], function(app) {
	'use strict';

	app.directive('exFornecedor', ['$timeout',
	                               'fornecedorService', function($timeout,
	                            		   fornecedorService,
	                            		   msSegurancaService) {

		function link(scope, element, a) {

			if(scope.minChars==null){
				scope.minChars=3;
			}

			/**
			 * Metodo que filtra os resultados de acordo com o que o usuario vai informando
			 */
			scope.completarFornecedor = function(termo) {
				if(termo && termo != null ) {
					return fornecedorService.recuperarFornecedoresPorTermo(termo.toString())
					.then(function(data) {
						return data.resultado;
					});
				} else {
					return [];
				}
			};

			/***
			 * Verifica se um agente foi selecionado ao perder o foco do campo,
			 * caso nao tenha sido selecionado da lista, resetar o valor
			 */
			scope.verificaSelecaoFornecedor = function(){
				$timeout(function (){
					if(!scope.valor || !scope.valor.id) {
						scope.valor = null;
						onChange();
					}
				}, 100);
			};


			/**
			 * Verifica se o fornecedor deve ser desativado
			 */
			scope.disabled = function() {
				if(scope.desativado){
					return true;
				}

				return false;
			};


			/**
			 * Funcao executada quando um item é selecionado na lista
			 */
			scope.selecionarFornecedor = function (fornecedor) {
				scope.valor = fornecedor;
				onChange();
			};


			/**
			 * Metodo chamado ao alterar um forneceodr
			 */
			var onChange = function() {
				if(scope.onChangeFn){
					scope.onChangeFn(scope.valor);
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


			/**
			 * Transforma de vazio para null
			 */
			scope.$watch('valor', function name() {
				if(!scope.valor || scope.valor === null || scope.valor === '') {
					scope.valor = null;
					onChange();
				}
			});
		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			template: function(element, a) {
				var id = Math.random().toString(36).substring(10);

				var template =
					'<div class="{{tamanhoSpan}} autocomplete"> '+
					'	<label for="'+id+'">{{"fornecedor" | translate}} <em class="form-req">{{obrigatorio ? "*" : ""}}</em></label> '+
					'	<input id="'+id+'" class="form-control" type="text" '+
					'		ng-required="obrigatorio" '+
					' 		ng-model="valor" '+
					'		ng-blur="verificaSelecaoFornecedor()" '+
					'		ng-disabled="disabled()" '+
					'		placeholder="Nome ou CNPJ"  '+
					'		typeahead-min-length="{{minChars}}" '+
					'		typeahead-wait-ms="200" '+
					'		typeahead="f as + (f.cnpj | cnpj) + \' - \' + f.nome for f in completarFornecedor($viewValue)"  '+
					'		typeahead-on-select="selecionarFornecedor($item)">  '+
					'	<ex-obrigatorio mostrar-quando="mostraMsgErro()"></ex-obrigatorio> '+
					'</div> ';

				return template;
			},
			scope: {
				tamanhoSpan: '=',
				desativado: "=",
				msgErroQuando: "=",
				valor: "=",
				obrigatorio: "=",
				onChangeFn : "=",
				minChars:"=?"
			}
		};
	}]);

	return app;
});