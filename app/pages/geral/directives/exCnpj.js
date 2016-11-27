define(['msAppJs'], function(app) {
	'use strict';

	/**
	 * Diretiva para campo com cnpj
	 */
	app.directive('exCnpj', ["$timeout",
	                         "$rootScope",
	                         "apoioService",
	                         "$msNotifyService",
	                         function($timeout,
	                        		 $rootScope,
	                        		 apoioService,
	                        		 $msNotifyService) {
		function link(scope, elm, attrs) {
			/**
			 * Mascara o cnpj
			 */
			var mascararCNPJ = function(cnpj){
				return window.geral.aplicarMascara(cnpj, '00.000.000/0000-00');
			};



			/**
			 * Listener para aplicar a mascara assim que a diretiva for carregada
			 */
			var cancelarWatchInicial = scope.$watch('valor', function(newValue, oldValue) {
				if (!window.geral.isEmpty(newValue)) {
					scope.valor =  mascararCNPJ(newValue.extractNumbers());
					cancelarWatchInicial();
				}
			});



			/**
			 * Binda o evento paste e keypress
			 */
			scope.pasteKeypress = function() {
				$timeout(function() {
					if(scope.valor){
						scope.valor = mascararCNPJ(scope.valor.extractNumbers());
						if(scope.valor.extractNumbers().length === 14) {
							if(scope.consultarCnpj) {
								chamarMetodoConsulta();
							} else {
								chamarMetodoMudanca();
							}
						}
					}
				}, 1);
			};


			/**
			 * Binda evento blur
			 */
			scope.blur = function() {
				$timeout(function() {
					if(scope.valor) {
						if(scope.valor.extractNumbers().length < 14){
							scope.valor = null;
							chamarMetodoMudanca(null);
						}
					} else {
						chamarMetodoMudanca(null);
					}
				}, 1);
			};


			/**
			 * Chama o metodo passado via parametro para executar a acao desejada quando esse componente mudar de valor
			 * Chama o callback passando o valor atual do campo e a resposta da consulta, caso ela exista.
			 */
			var chamarMetodoMudanca = function(resultado) {
				if(scope.onChangeFn) {
					scope.onChangeFn(scope.valor, resultado);
				}
			};


			//Mantem um lock para que duas chamadas nao aconteçam simultaneamente
			var lockConsulta = false;

			/**
			 * Chama o metodo de consulta
			 */
			var chamarMetodoConsulta = function() {
				if(window.CNPJ.isValid(scope.valor) && scope.consultarCnpj) {
					//Se esta trancado, retorna e nao permite outra chamada até que o lock seja liberado
					//Intevalo entre consultas eh de 3 segundos
					if(lockConsulta) {
						return;
					} else {
						lockConsulta = true;
						$timeout(function() {
							lockConsulta = false
						}, 3000);
					}

					$msNotifyService.loading();
					apoioService.consultarPessoaJuridicaPorId(scope.valor.extractNumbers())
					.then(function(data) {
						$msNotifyService.close();
						var respostaConsulta = window.geral.isEmpty(data.resultado) ? null : data.resultado;

						if(!respostaConsulta)
							$rootScope.showMsg('E', 'cnpj-nao-encontrado');

						chamarMetodoMudanca(respostaConsulta);
					}, function(e) {
						$msNotifyService.close();
						chamarMetodoMudanca(null);
						$rootScope.showMsg('E', e.data.mensagens[0].texto, false);
					});
				} else {
					chamarMetodoMudanca(null);
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
			 * Verifica se o campo é inválido
			 */
			scope.isInvalido = function() {
				if(scope.valor){
					return !window.CNPJ.isValid(scope.valor);
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
					'	<input id="'+id+'" type="text" ng-model="valor" '+
					' 	ng-blur="blur()" ng-keypress="pasteKeypress()" ng-paste="pasteKeypress()" '+
					'	class="span4 right" maxlength="18" '+
					'       ng-required="obrigatorio" ng-disabled="desativado"> '+
					'	<ex-obrigatorio mostrar-quando="msgErroQuando&&!isInvalido()"></ex-obrigatorio> '+
					'	<div ng-show="isInvalido()&&!msgErroQuando" class="alert alert-danger">{{"cnpj-invalido" | translate}}</div> '+
					'</div> ';
				return template;
			},
			scope: {
				tamanhoSpan: "=",
				desativado: "=",
				valor: "=",
				rotulo: "=",
				consultarCnpj: "=",
				obrigatorio: "=",
				msgErroQuando: "=",
				onChangeFn: "="
			}
		};
	}]);


	return app;
});