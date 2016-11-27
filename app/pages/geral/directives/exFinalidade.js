define(['msAppJs',
        'pages/geral/directives/exMultiSelect'], function(app) {
	'use strict';

	app.directive('exFinalidade', ['apoioService',
	                               '$timeout',
	                               function(apoioService,
	                            		   $timeout) {

		function link(scope, element, a) {

			var isListaLimpa = function() {
				var listaLimpa = true;

				angular.forEach(scope.tiposFinalidadeList, function(value, key) {
					if(value.selected) { //se ja houver algum selecionado
						listaLimpa = false;
					}
				});

				return listaLimpa;
			}



			/**
			 * Quando os itens selecionados forem limpados, limpar tb a lista de referencia do
			 */
			if(scope.multi) {
				scope.$watch('valor', function(newVal, oldVal) {
					if((newVal != null && newVal.length == 0)
							&& (oldVal != null && oldVal.length > 0)) {
						scope.tiposFinalidadeList = angular.copy(scope.copiaLimpaTiposFinalidadeList);
					} else if((newVal != null && newVal.length > 0) && isListaLimpa()) {

						angular.forEach(newVal, function(value, key) {
							var tipoFinaliade = _.findWhere(scope.tiposFinalidadeList , {'id': value.id});
							tipoFinaliade.selected = true;
						});
					}
				});
			}


			/**
			 * Lista as agencia por ano ou sem ano
			 */
			apoioService.tiposFinalidadeList()
			.then(function (data){
				scope.tiposFinalidadeList = data.resultado;
				scope.copiaLimpaTiposFinalidadeList = angular.copy(scope.tiposFinalidadeList);
			});


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
				if(scope.desativado && scope.desativado === true){
					return true;
				} else {
					return false;
				}
			};


			/**
			 * Chama o metodo passado via parametro para executar a acao desejada quando esse componente mudar de valor
			 */
			scope.chamarMetodoMudanca = function() {
				if(scope.onTipoPublicidadeChangeFn){
					scope.onTipoPublicidadeChangeFn(scope.valor);
				}
			};

			scope.abrirMultiSelect = function(id) {
				$timeout(function() {
					angular.element('#'+id+' button').click();
				});
			}
		}


		return {
			restrict: 'E',
			replace: true,
			link: link,
			template: function(element, attrs) {
				var id = Math.random().toString(36).substring(10);

				var templateSingle =
					'<div class="{{tamanhoSpan}}">  ' +
					'	<label for="'+id+'">{{\singleLabel ? singleLabel : \'finalidade\' | translate}} <em class="form-req">{{obrigatorio ? "*" : ""}}</em></label>' +
					'	<select id="'+id+'" class="form-control" '+
					' 		ng-model="valor" '+
					' 		ng-disabled="disabled()" '+
					' 		ng-change="chamarMetodoMudanca()" '+
					'		ng-required="obrigatorio" '+
					'		ng-options="tf.descricao for tf in tiposFinalidadeList track by tf.id"> ' +
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
					'	    input-model="tiposFinalidadeList"  '+
					'	    output-model="valor"  '+
					'		tick-property="selected" '+
					'		is-disabled="disabled()" '+
					'	    max-labels="{{maxLabels ? maxLabels : 1}}"  '+
					'	    helper-elements="all none filter"  '+
					'	    filter-label="Filtrar..." '+
					'		max-height="90px" '+
					'	    button-label="descricao" '+
					'	    item-label="descricao maker" '+
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
				onTipoPublicidadeChangeFn: "=",
				tamanhoSpan: "="
			}
		};
	}]);

	return app;
});