define(['msAppJs',
        "pages/geral/directives/exFileSelector",
        'pages/fatura/services/faturaService'], function(app) {
	'use strict';

	app.directive('exAnexoFatura', ['faturaService',
	                                              'ngTableParams',
	                                              function(faturaService,
	                                            		  ngTableParams) {

		function link(scope, element, attrs) {

				scope.readonly=attrs.readonly==='true'?true:false;


			scope.anexoFaturaList=[];
			scope.arquivos=[];
			/**
			 * Fica observando quando a whatsapp muda de valor e recarrega os dados de historico
			 */
			scope.$watch("fatura", function(newVal, oldVal) {
				if(newVal && newVal.id) {
					carregarListaAnexo();
				}
			});


			/**
			 * Carrega a lista de historico
			 */
			var carregarListaAnexo = function() {
				faturaService.recuperarAnexosFatura(scope.fatura.id)
				.then(function(s) {
					scope.anexoFaturaList = s.resultado;

					for(var i=0;i<scope.anexoFaturaList.length;i++) {
						//scope.anexoFaturaList[i].nome=scope.anexoFaturaList[i].arquivo.nome;
						scope.anexoFaturaList[i].excluido=false;
						scope.anexoFaturaList[i].novo=false;
					}

					carregarTabelaAnexoFatura();
				});
			}


			/**
			 * Carrega a tabela de historico da whatsapp que é exibida na tela
			 */
			var carregarTabelaAnexoFatura = function() {
				scope.tabelaAnexoFatura = new ngTableParams({
					page: 1,
					count: 10
				}, {
					total: 0,
					getData: function($defer, params) {
						var dados = (scope.anexoFaturaList);
						var dadosPaginaAtual = dados.slice((params.page() - 1) * params.count(), params.page() * params.count());

						params.total(dados.length);
						$defer.resolve(dadosPaginaAtual);
					}
				});
			};

			scope.adicionarArquivo=function(){
				var file=$("input[ng-model='nomeArquivo']").parent(":eq(0)").next(":file");

				scope.novoArquivo.arquivo.nome=scope.novoArquivo.arquivo.arquivoBinario.name;
				scope.novoArquivo.arquivo.nomeCompleto=scope.novoArquivo.arquivo.nome;
				scope.novoArquivo.arquivo.novo=true;

				var novo=angular.copy(scope.novoArquivo);
				novo.arquivoBinario=file[0].files[0];
				novo.registroAtivo=true;
				scope.anexoFaturaList.push(novo);

				scope.novoArquivo=scope.novoAnexo();

				if(!scope.tabelaAnexoFatura)carregarTabelaAnexoFatura();

				scope.tabelaAnexoFatura.reload();
			}

			scope.removerArquivo=function(arquivo){
				if(arquivo.id==null){
					scope.anexoFaturaList = _.without(scope.anexoFaturaList, arquivo);
				} else {
					angular.forEach(scope.anexoFaturaList, function(value, key) {
						if(arquivo.$$hashKey = value.$$hashKey) {
							value.registroAtivo=false;
							arquivo.excluido=true;
						} else {
							return false;
						}
					});

					arquivo.registroAtivo=false;
				}

				console.log(scope.anexoFaturaList);

				scope.tabelaAnexoFatura.reload()
			}


			/**
			 * Funcao utilitaria para exbir o total de atividades ativas da mild atual
			 */
			scope.totalAnexosAtivos = function () {
				var ativo = 0;

				if(scope.anexoFaturaList && scope.anexoFaturaList.length > 0){
					for (var i = 0; i < scope.anexoFaturaList.length; i++) {
						if(scope.anexoFaturaList[i].registroAtivo) {
							ativo++;
						}
					}
				}
				return ativo;
			};


			scope.isExcluido=function(value,index){
				return !(value.excluido==true);
			}

			scope.valida=function(){
				if(window.geral.isEmpty(scope.novoArquivo.nome)){
					scope.showMsg('E',"necessario-informar-campos-obrigatorios");
					return false;
				}
				return true;

			}


		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			templateUrl: './app/pages/whatsapp/directives/templates/exAnexoFatura.html',
			scope: true
		};
	}]);

	return app;
});