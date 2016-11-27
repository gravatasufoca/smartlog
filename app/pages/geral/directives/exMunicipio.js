define(['msAppJs'], function(app) {
	'use strict';

	app.directive('exMunicipio', ['$timeout',
	                              'apoioService',
	                              'msSegurancaService',
	                              '$filter', function($timeout,
	                            		  apoioService,
	                            		  msSegurancaService,
	                            		  $filter) {

		function link(scope, element, a) {
			var perfilAcesso = msSegurancaService.getUsuario().perfil;


			/**
			 * Metodo que completa o município a medida em que o usuário vai digitando
			 * Recebe o id do município selecionado na tela e o nome parcial
			 */
			scope.completarMunicipioPorUfNome = function(nomeParcial) {
				var nomeConsulta = '';
				if(nomeParcial && nomeParcial !== null){
					nomeConsulta = nomeParcial.toString();
				}

				if(nomeConsulta !== '') {
					return apoioService.municipiosPorUfNomeList(nomeParcial)
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
			scope.verificaSelecaoMunicipio = function(){
				$timeout(function (){
					if(!scope.valor || !scope.valor.id) {
						if(scope.valor)
							scope.valor = {id: null, uf: null, nome: scope.valor, registroAtivo:true};
						else
							scope.valor = null;

						municipioChange();
					}
				}, 100);
			};


			/**
			 * Verifica se o municipio deve ser desativado
			 */
			scope.disabled = function() {
				if(!window.geral.isEmpty(scope.desativado) && scope.desativado === true) {
					return true;
				} if(window.geral.isEmpty(scope.valorUf) || !scope.valorUf.id || scope.valorUf.id === null){
					return true;
				} else {
					if(window.geral.isEmpty(scope.validarPerfil) || scope.validarPerfil === true){
						//validaçoes de perfil
						return verificaPerfilAcesso();
					}
				}

				return false;
			};


			/**
			 * Funcao executada quando um item é selecionado na lista
			 */
			scope.selecionarMunicipio = function (municipio) {
				scope.valor = municipio;
				municipioChange();
			};


			/**
			 * Metodo chamado ao alterar um municipio
			 */
			var municipioChange = function() {
				if(scope.onMunicipioChangeFn){
					scope.onMunicipioChangeFn(scope.valor);
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
				if(window.geral.isEmpty(scope.valor)) {
					scope.valor = null;
					municipioChange();
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
					'<div class="span5 autocomplete"> '+
					'	<label for="'+id+'">{{label | translate}} <em class="form-req">{{obrigatorio ? "*" : ""}}</em></label> '+
					'	<input id="'+id+'" class="form-control" type="text" '+
					'		ng-required="obrigatorio" '+
					' 		ng-model="valor" '+
					'		ng-blur="verificaSelecaoMunicipio()" '+
					'		placeholder="{{\'nome-codigo-ibge-municipio\' | translate}}"  '+
					'		typeahead="m as m.nome for m in completarMunicipioPorUfNome($viewValue)"  '+
					'		typeahead-on-select="selecionarMunicipio($item)">  '+
					'	<ex-obrigatorio mostrar-quando="mostraMsgErro()"></ex-obrigatorio> '+
					'</div> ';

				return template;
			},
			scope: {
				desativado: "=",
				msgErroQuando: "=",
				valorUf: '=',
				valor: "=",
				obrigatorio: "=",
				label: "=",
				onMunicipioChangeFn : "="
			}
		};
	}]);

	return app;
});