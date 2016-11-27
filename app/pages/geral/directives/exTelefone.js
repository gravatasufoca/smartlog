define(['msAppJs'], function(app) {
	'use strict';

	/**
	 * Diretiva para campo Telefone
	 */
	app.directive('exTelefone', ["$timeout", function($timeout) {
		function link(scope, elm, attrs) {
			scope.tamanhoEfetivo = 8;
			scope.tamanhoCampo = 10;

			if(scope.comDdd) {
				scope.tamanhoEfetivo = 10;
				scope.tamanhoCampo = 15;
				console.log(scope.comDdd);
			}

			/**
			 * Mascara o telefone
			 */
			var mascararTelefone = function(telefone){
				var ddd = scope.comDdd ? '(00) ' : '';

				if(telefone.length <= scope.tamanhoEfetivo){
					return window.geral.aplicarMascara(telefone, ddd+'0000-0000');
				} else {
					return window.geral.aplicarMascara(telefone, ddd+'00000-0000');					
				}				
			};


			/**
			 * Listener para aplicar a mascara assim que a diretiva for carregada 
			 */
			var cancelarWatchInicial = scope.$watch('valor', function(newValue, oldValue) {
				if (!window.geral.isEmpty(newValue)) {
					scope.valor =  mascararTelefone(newValue.extractNumbers());
					cancelarWatchInicial();
				}
			});


			/**
			 * Binda o evento paste
			 */
			scope.paste = function() {
				$timeout(function() {
					e.preventDefault();
				});
			};


			/**
			 * Binda o evento paste e keypress
			 */
			scope.keypress = function() {
				$timeout(function() {
					if(scope.valor) {
						scope.valor = mascararTelefone(scope.valor.extractNumbers());
					}
				}, 1);
			};


			/**
			 * Binda evento blur
			 */
			scope.blur = function() {
				$timeout(function() {
					if(scope.valor) {
						if(scope.valor.extractNumbers().length >= scope.tamanhoEfetivo){
							scope.valor = mascararTelefone(scope.valor.extractNumbers());
						} else {
							scope.valor = null;
						}
					} else {
						chamarMetodoMudanca();
					}
				}, 1);
			};


			/**
			 * Chama o metodo passado via parametro para executar a acao desejada quando esse componente mudar de valor
			 */
			var chamarMetodoMudanca = function() {
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
		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			template: function(element, attrs) { 
				var id = Math.random().toString(36).substring(10);

				var template = 
					'<div class="{{tamanhoSpan}}"> ' + 
					'	<label for="'+id+'">{{rotulo | translate}} <em class="form-req">{{obrigatorio ? "*" : ""}}</em></label> '+
					'	<input id="'+id+'" type="text" placeholder="" ng-model="valor" '+
					' 	ng-blur="blur()" ng-keypress="keypress()" ng-paste="paste()" '+
					'	class="right" maxlength="{{tamanhoCampo}}" ng-required="obrigatorio" ng-disabled="desativado"> '+
					'	<ex-obrigatorio mostrar-quando="msgErroQuando"></ex-obrigatorio> '+
					'</div> ';
				return template;
			},
			scope: {
				tamanhoSpan: '=',
				desativado: "=",
				comDdd: "=",
				valor: "=",
				rotulo: "=",
				obrigatorio: "=",
				msgErroQuando: "=",
				onChangeFn: "="
			}
		};
	}]);


	return app;
});