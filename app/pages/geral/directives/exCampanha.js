define(['msAppJs',
        'pages/geral/directives/exMultiSelect',
        'pages/campanha/services/campanhaService'], function(app) {
	'use strict';
	app.directive('exCampanha', ['campanhaService', function(campanhaService) {

		function link(scope, element, a) {

			var isListaLimpa = function() {
				var listaLimpa = true;

				angular.forEach(scope.campanhasList, function(value, key) {
					if(value.selected) { //se ja houver algum selecionado
						listaLimpa = false;
					}
				});

				return listaLimpa;
			}


			/**
			 * Lista as campanhas que seram exibidas nas combo por ano
			 */
			scope.$watch("ano", function(a, b) {
				if(scope.ano) {
					campanhaService.campanhasPorAnoList(scope.ano)
					.then(function (data){
						scope.campanhasList = data.resultado;
					});
				} else {
					campanhaService.campanhasList()
					.then(function(data) {
						scope.campanhasList = data.resultado;
						scope.copiaLimpaCampanhasList = angular.copy(scope.campanhasList);
					});
				}
			});


			/**
			 * Quando os itens selecionados forem limpados, limpar tb a lista de referencia do
			 */
			if(scope.multi) {
				scope.$watch('valor', function(newVal, oldVal) {
					if((newVal != null && newVal.length == 0)
							&& (oldVal != null && oldVal.length > 0)) {
						scope.campanhasList = angular.copy(scope.copiaLimpaCampanhasList);
					} else if((newVal != null && newVal.length > 0) && isListaLimpa()) {

						angular.forEach(newVal, function(value, key) {
							var campanha = _.findWhere(scope.campanhasList , {'id': value.id});
							campanha.selected = true;
						});
					}
				});
			}


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
			 * Define se o campo estara desativado
			 */
			scope.disabled = function() {
				if((scope.desativado && window.geral.isEmpty(scope.ano)) || scope.desativado){
					return true;
				}
				return false;
			};


			/**
			 * Chama o metodo passado via parametro para executar a acao desejada quando esse componente mudar de valor
			 */
			scope.chamarMetodoMudanca = function() {
				if(scope.onCampanhaChangeFn){
					scope.onCampanhaChangeFn(scope.valor);
				}
			};


			scope.abrirMultiSelect = function(id) {
				$timeout(function() {
					angular.element('#'+id+' button').click();
				});
			};
		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			template: function(element, attrs) {
				var id = Math.random().toString(36).substring(10);

				var templateSingle =
					'<div class="{{tamanhoSpan}}">  ' +
					'	<label for="'+id+'">{{\singleLabel ? singleLabel : \'campanha\' | translate}} <em class="form-req">{{obrigatorio ? "*" : ""}}</em></label>' +
					'	<select id="'+id+'" class="form-control" '+
					' 		ng-model="valor" '+
					' 		ng-disabled="disabled()" '+
					' 		ng-change="chamarMetodoMudanca()" '+
					'		ng-required="obrigatorio" '+
					'		ng-options="c.nome + - + c.anoExercicio for c in campanhasList track by c.id"> ' +
					'			<option value="">{{obrigatorio ? "selecione" : "todos" | translate}}</option> ' +
					'	</select> '+
					'	<ex-obrigatorio mostrar-quando="mostraMsgErro()"></ex-obrigatorio> '+
					'</div> ';


				var templateMulti =
					'<div class="{{tamanhoSpan}}">  '+
					'	<label>{{\label | translate}} <em class="form-req">{{obrigatorio ? "*" : ""}}</em></label>									 '+
					'	<ex-multi-select '+
					'	    style="padding-bottom:9px;"  '+
					'	    directive-id="'+id+'"  '+
					'	    input-model="campanhasList"  '+
					'	    output-model="valor"  '+
					'		tick-property="selected" '+
					'		is-disabled="disabled()" '+
					'	    max-labels="{{maxLabels ? maxLabels : 1}}"  '+
					'	    helper-elements="all none filter"  '+
					'	    filter-label="Filtrar..." '+
					'		max-height="90px" '+
					'	    button-label="nome" '+
					'	    item-label="nome maker" '+
					'	    default-label="{{defaultLabel ? defaultLabel : \'Selecione\'}}" '+
					'	    all-label="Todos" '+
					'	    none-label="Nenhum"> '+
					'	</ex-multi-select> '+
					'	<ex-obrigatorio mostrar-quando="mostraMsgErro()"></ex-obrigatorio> '+
					'</div> ';

				return attrs.multi && attrs.multi === 'true' ? templateMulti : templateSingle;
			},

			scope: {
				singleLabel: "=",
				desativado: "=",
				defaultLabel: "=",
				label: "=",
				maxLabels: "=",
				msgErroQuando: "=",
				valor: "=",
				obrigatorio: "=",
				multi: "=",
				onCampanhaChangeFn: "=",
				tamanhoSpan: "="
			}
		};
	}]);

	return app;
});