define(['msAppJs',
        'pages/geral/directives/exMultiSelect'], function(app) {
	'use strict';

	app.directive('exAno', function() {

		function link(scope, element, a) {
			var anosFuturos = 0;
			var ateAno = (new Date()).getFullYear();
			var anos = [];

			if(scope.anosFuturos && scope.anosFuturos != null) {
				anosFuturos = scope.anosFuturos;
			}

			if(scope.de && scope.de != null) {
				var cont = 1;

				if(scope.ate && scope.ate != null){
					ateAno = scope.ate;
				}

				if(a.multi && a.multi === 'true') {
					for(var i = ateAno+anosFuturos; i >= scope.de; i--){
						var ano = {id: null, nome: null};

						ano.id = cont;
						ano.nome = i;

						anos.push(ano);

						cont++;
					}
				} else {
					for(var i = ateAno+anosFuturos; i >= scope.de; i--){
						anos.push(i);
					}
				}

				scope.anosList = anos;
			} else {
				anos.push(ateAno+anosFuturos);
				scope.anosList = anos;
			}

			/**
			 * Chama o metodo passado via parametro para executar a acao desejada quando esse componente mudar de valor
			 */
			scope.chamarMetodoMudanca = function() {
				if(scope.onAnoChangeFn){
					scope.onAnoChangeFn(scope.valor);
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
			template: function(element, a) {
				var id = Math.random().toString(36).substring(10);

				var templateSingle =
					'<div class="{{tamanhoSpan}}"> '+
					'	<label for="'+id+'">{{rotulo | translate}} <em class="form-req"> {{obrigatorio ? "*" : ""}}</em></label>  '+
					'	<select id="'+id+'" class="form-control" ng-model="valor" ng-required="obrigatorio" '+
					'		ng-change="chamarMetodoMudanca()" '+
					'		ng-disabled="desativado" '+
					'		ng-options="s as s for s in anosList"> '+
					'		<option value="">{{obrigatorio ? "selecione" : "todos" | translate}}</option> '+
					'	</select> '+
					'	<ex-obrigatorio mostrar-quando="msgErroQuando"></ex-obrigatorio> '+
					'</div> ';

				var templateMulti =
					'<div class="{{tamanhoSpan}}">  '+
					'	<label>{{rotulo | translate}} <em class="form-req">{{obrigatorio ? "*" : ""}}</em></label>									 '+
					'	<ex-multi-select '+
					'	    style="padding-bottom:9px;"  '+
					'	    directive-id="'+id+'"  '+
					'	    input-model="anosList"  '+
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

				return a.multi && a.multi === 'true' ? templateMulti : templateSingle;
			},
			scope: {
				singleLabel: "=",
				rotulo: "=",
				defaultLabel: "=",
				desativado: "=",
				valor: "=",
				de: "=",
				ate: "=",
				obrigatorio: "=",
				msgErroQuando: "=",
				onAnoChangeFn: "=",
				tamanhoSpan: "=",
				anosFuturos : "=",
				maxLabels: "=",
				multi: "="
			}
		};
	});

	return app;
});