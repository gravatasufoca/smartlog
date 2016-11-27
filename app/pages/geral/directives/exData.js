define(['msAppJs', './calendarLocales'], function(app, calendarLocales) {
	'use strict';

	//Carrega os locales
	var locales = calendarLocales;

	/**
	 * Faz um input date
	 */
	app.directive('exData', ['$locale', '$timeout', function($locale, $timeout) {
		function link(scope, element, a) {
			angular.copy(locales.pt_BR, $locale);
			scope.format = 'dd/MM/yyyy';

			scope.opened = false;
			scope.dataValida = true;

			scope.open = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				scope.opened = true;
			};

			scope.disabled = function() {
				if(scope.desativado){
					return true;
				}
				return false;
			};


			scope.dayDisabled = function(date, mode) {
				var isDisabled = false;

				if (scope.naoPermiteFinalSemana){
					isDisabled = isDisabled || (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6 ));
				}

				if(scope.naoPermiteFutura) {
					isDisabled = isDisabled || (mode === 'day' && (+date > +(new Date())));
				}

				if(scope.apenasAno) {
					isDisabled = isDisabled || (mode === 'day' && date.getFullYear() !== scope.apenasAno);;
				}

				return isDisabled;
			};


			var input = element.find('input')[0];
			var teclasPermitidas = [8, 46, 13, 27, 37, 38, 39, 40]; // backspace, delete, enter, escape, arrows

			$(input).on('paste', function(e) {
				e.preventDefault();
			});

			//Removendo os eventos de change para evitar conflitos no Firefox
			$(input).off('change');

			$(input).on('blur change', function() {
				$timeout(function(){
					var dataMoment = moment(input.value, "DD/MM/YYYY");

					if(scope.dayDisabled(dataMoment._d, "day")) {
						scope.valor = null;
					} else {
						if(input.value.length < 10) {
							input.value = '';
							scope.valor = null;
						} else if(input.value.length == 10 && dataMoment.isValid()){
							scope.valor = new Date(dataMoment._d.getTime());
							scope.dataValida = true;
						} else {
							scope.valor = null;
							scope.dataValida = false;
						}
						chamarMetodoMudanca();
						scope.$apply();
					}
				}, 200);
			});


			$(input).on('keypress', function(e) {
				var tecla = e.keyCode || e.which;

				if(!teclaValida(tecla)){
					e.preventDefault();
					return false;
				} else {
					scope.opened = false;
					if (!_.contains(teclasPermitidas, tecla)) {  // backspace, delete, enter, escape, arrows
						var valor = input.value + String.fromCharCode(tecla);
						valor = formatarValor(valor);

						if(valor.length <= 10)
							input.value = valor;
						if(valor.length == 10) {
							var dataMoment = moment(valor, "DD/MM/YYYY");
							scope.dataValida = dataMoment.isValid();
							if(scope.dataValida) {
								scope.valor = new Date(dataMoment._d.getTime());
								chamarMetodoMudanca();
							} else {
								scope.dataValida = false;
							}

							scope.$apply();
						}
						e.preventDefault();
					}
				}
			});


			/**
			 * Verifica se a tecla digitada é valida
			 */
			var teclaValida = function(tecla){
				if (_.contains(teclasPermitidas, tecla)) {
					// backspace, delete, enter, escape, arrows
					return true;
				} else if (tecla >= 48 && tecla <= 57) {
					// numberss
					return true;
				} else {
					return false;
				}
			};


			/**
			 * Formata o valor a ser exibido
			 */
			var formatarValor = function(valor) {
				if(valor.length == 2 || valor.length == 5){
					valor += '/';
				}
				return valor;
			};


			/**
			 * Chama o metodo passado via parametro para executar a acao desejada quando esse componente mudar de valor
			 */
			var chamarMetodoMudanca = function() {
				if(scope.onDateChangeFn){
					scope.onDateChangeFn(scope.valor);
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
			template: function(element, a) {
				var id = Math.random().toString(36).substring(10);

				var template =
					'<div class="{{tamanhoSpan}}"> '+
					'	<label for="'+id+'">{{rotulo | translate}} <em class="form-req">{{obrigatorio ? "*" : ""}}</em></label> '+
					'	<p class="input-group"> '+
					' 		<input id="'+id+'" type="text"  '+
					'  		placeholder="DD/MM/AAAA"' +
					'  		show-weeks="false" '+
					'  		show-button-bar="false" '+
					'  		class="form-control right"  '+
					'  		datepicker-popup="{{format}}"  '+
					'  		ng-model="valor"  '+
					'  		is-open="opened"  '+
					'  		date-disabled="dayDisabled(date, mode)"  '+
					'  		ng-disabled="disabled()"  '+
					'  		ng-required="obrigatorio" maxlength="10">'+
					'  		<span class="input-group-btn"> '+
					'			<button ng-disabled="disabled()" type="button" class="btn btn-default" ng-click="open($event)"><i class="font15px fa fa-calendar"></i></button> '+
					'  		</span> '+
					'	</p> '+
					'	<div ng-show="!dataValida" class="alert alert-danger" id="-error-message">Data inválida</div> '+
					'	<ex-obrigatorio mostrar-quando="mostraMsgErro()"></ex-obrigatorio>';
				'</div>';

				return template;
			},
			scope: {
				desativado: "=",
				msgErroQuando: "=",
				valor: "=",
				obrigatorio : "=",
				onDateChangeFn: "=",
				tamanhoSpan: "=",
				rotulo : "=",
				naoPermiteFutura: "=",
				naoPermiteFinalSemana: "=",
				apenasAno : "="
			},
			link : link
		};
	}]);

	return app;
});