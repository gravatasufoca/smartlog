define(['msAppJs'], function(app) {
	'use strict';

	app.directive('exMes', function() {

		function link(scope, element, a) {
			scope.mesesList = [{id:1, nome:"Janeiro"},
			                   {id:2, nome:"Fevereiro"},
			                   {id:3, nome:"Mar\u00e7o"},
			                   {id:4, nome:"Abril"},
			                   {id:5, nome:"Maio"},
			                   {id:6, nome:"Junho"},
			                   {id:7, nome:"Julho"},
			                   {id:8, nome:"Agosto"},
			                   {id:9, nome:"Setembro"},
			                   {id:10, nome:"Outubro"},
			                   {id:11, nome:"Novembro"},
			                   {id:12, nome:"Dezembro"}];

			/**
			 * Chama o metodo passado via parametro para executar a acao desejada quando esse componente mudar de valor
			 */
			scope.chamarMetodoMudanca = function() {
				if(scope.onChangeFn){
					scope.onChangeFn(scope.valor);
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
					'	<label for="'+id+'">{{rotulo | translate}} <em class="form-req"> {{obrigatorio ? "*" : ""}}</em></label>  '+
					'	<select id="'+id+'" class="form-control" ng-model="valor" ng-required="obrigatorio" '+
					'		ng-change="chamarMetodoMudanca()" '+
					'		ng-disabled="desativado" '+
					'		ng-options="s.nome for s in mesesList"> '+
					'		<option value="">{{obrigatorio ? "selecione" : "todos" | translate}}</option> '+
					'	</select> '+
					'	<ex-obrigatorio mostrar-quando="msgErroQuando"></ex-obrigatorio> '+
					'</div> ';
				return template;
			},
			scope: {
				desativado: "=",
				rotulo: "=",
				valor: "=",
				obrigatorio: "=",
				msgErroQuando: "=",
				onChangeFn: "=",
				tamanhoSpan: "="
			}
		};
	});

	return app;
});