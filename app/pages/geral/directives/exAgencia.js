define(['msAppJs',
        'pages/agencia/services/agenciaService'], function(app) {
	'use strict';

	app.directive('exAgencia', ['$timeout',
	                            'agenciaService',
	                            function($timeout,
	                            		agenciaService) {

		function link(scope, element, a) {

			/**
			 * Metodo que filtra os resultados de acordo com o que o usuario vai informando
			 */

			/**
			 * Trata o resultado de uma das consultas por agencia
			 */
			var tratarResultado = function() {
				consultaPromisse
				.then(function(data) {
					scope.listaAgencias = data.resultado;
				});
			};

			var consultaPromisse = null;

			/**
			 * Verifica qual consulta realizar
			 */
			if(scope.apenasComContratoEmpenho && scope.apenasComContratoEmpenho === true) {
						consultaPromisse = agenciaService.listarAgenciasContratoEmpenhoPorAno(new Date().getFullYear());
						tratarResultado();
			} else if(scope.apenasComEmpenhoNoAno && scope.apenasComEmpenhoNoAno === true) {
						consultaPromisse = agenciaService.listarAgenciaEmpenhoPorAno(new Date().getFullYear());
						tratarResultado();
						cancelaWatch();
			} else {
				consultaPromisse = agenciaService.listarAgencias();
				tratarResultado();
			}

			/**
			 * Verifica se o agencia deve ser desativado
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
			scope.selecionarAgencia = function (agencia) {
				scope.valor = agencia;
				onChange();
			};


			/**
			 * Metodo chamado ao alterar uma agencia
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
				} else {
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
					'	<label for="'+id+'">{{(label ? label : "agencia") | translate}} <em class="form-req">{{obrigatorio ? "*" : ""}}</em></label> '+
					'	<select id="'+id+'" class="form-control" ng-model="valor" '+
					'		ng-options="agencia.nome for agencia in listaAgencias track by agencia.id" '+
					'		ng-disabled="disabled()" '+
					'		ng-required="obrigatorio"> '+
					'		<option value="">{{obrigatorio ? "selecione" : "todos" | translate}}</option> '+
					'	</select> '+
					'	<ex-obrigatorio mostrar-quando="mostraMsgErro()"></ex-obrigatorio> '+
					'</div> ';

				return template;
			},
			scope: {
				label : "=",
				tamanhoSpan: "=",
				desativado: "=",
				msgErroQuando: "=",
				valor: "=",
				obrigatorio: "=",
				onChangeFn : "=",
				apenasComContratoEmpenho:"=",
				apenasComEmpenhoNoAno:"=",
				ano : "="
			}
		};
	}]);

	return app;
});