define(['msAppJs',
        'pages/geral/directives/exDownloadArquivo'], function(app) { //REFATORAR
	'use strict';

	/**
	 * Faz um input file upload
	 */
	app.directive('exUpload', ['$upload',
	                           '$interval',
	                           '$rootScope',
	                           function($upload,
	                        		   $interval,
	                        		   $rootScope) {
		function link(scope, element, a) {
			scope.apiArquivos = 'api/arquivos';

			scope.nomeArquivo = "";
			scope.arquivoInvalido = false;
			scope.tamanhoExcendente = false;

			scope.disabled = function(date, mode) {
				if(scope.desativado){
					return true;
				}
				return false;
			};

			scope.$watch('valor', function() {
				if(scope.valor){
					scope.nomeArquivo = scope.valor.nome;
				}
			});


			var isArquivoPermitido = function(arquivo) {
				if(scope.tiposPermitidos && _.isArray(scope.tiposPermitidos)){
					var type =  arquivo.name.slice(arquivo.name.lastIndexOf('.') + 1);

					return _.contains(scope.tiposPermitidos, type);
				}
				return true;
			};


			var isTamanhoPermitido = function(arquivo) {
				if(scope.tamanhoMaximoKbytes){
					if(arquivo.size / 1024 <= scope.tamanhoMaximoKbytes){ //convertendo para kbytes
						return true;
					} else {
						return false;
					}
				}

				return true;
			};


			scope.adicionarArquivo = function($files) {
				var arquivo = $files[0];
				scope.nomeArquivo = arquivo.name;

				if(arquivo && isArquivoPermitido(arquivo) && isTamanhoPermitido(arquivo)) {
					scope.arquivoInvalido = false;
					scope.tamanhoExcendente = false;
					scope.$apply(function() {
						scope.valor.arquivoBinario = arquivo;
						chamarMetodoMudanca();
					});
				} else {
					if(arquivo && !isArquivoPermitido(arquivo)) {
						scope.arquivoInvalido = true;
					} else if(arquivo && !isTamanhoPermitido(arquivo)){
						scope.tamanhoExcendente = true;
					}

					chamarMetodoArquivoInvalido();
				}
			};


			/**
			 * Chama o metodo passado via parametro para executar a acao desejada quando esse componente mudar de valor
			 */
			var chamarMetodoMudanca = function() {
				if(scope.onArquivoCarregadoFn){
					scope.onArquivoCarregadoFn(scope.valor);
				}
			};


			/**
			 * Chama o metodo passado via parametro para executar a acao desejada quando esse componente tiver um valor invalido
			 */
			var chamarMetodoArquivoInvalido = function() {
				if(scope.onArquivoInvalidoFn){
					var situacao = {
							invalido: true,
							msgErro: "arquivo-tipo-invalido",
							msgTamMax: "tamanho-maximo-arquivo",
							arquivosPermitidos: scope.arquivosPermitidosString(),
							tamanhoPermitido: (scope.tamanhoMaximoKbytes / 1024 )+ " MB"
					}

					scope.onArquivoInvalidoFn(situacao);
				}
			};


			/**
			 * Verifica se é necessario mostrar a msg de erro
			 */
			scope.mostraMsgErro = function() {
				if(scope.obrigatorio && scope.obrigatorio === true && scope.msgErroQuando) {
					return true;
				} else {
					return false;
				}
			};


			/**
			 * Arquivos permitidos para upload
			 */
			scope.arquivosPermitidosString = function() {
				var arquivos = "";
				if(scope.tiposPermitidos && _.isArray(scope.tiposPermitidos)) {
					for (var i = 0; i < scope.tiposPermitidos.length; i++) {
						arquivos += scope.tiposPermitidos[i];

						if(i === scope.tiposPermitidos.length - 1) {
							arquivos += ".";
						} else {
							arquivos += ", ";
						}
					}
				}

				return arquivos;
			};


			scope.mostarBotaoDownload = function() {
				if(scope.exibirBotaoDownload && scope.valor && scope.valor.id != null) {
					return true;
				}

				return false;
			};
		}

		return {
			restrict: 'E',
			replace: true,
			template: function(element, a) {
				var id = Math.random().toString(36).substring(10);
				var idSearch = Math.random().toString(36).substring(10);
				var idDownload = Math.random().toString(36).substring(10);

				var template =
					'<div class="{{tamanhoSpan}}"> '+
					'  <label for="'+id+'">{{rotulo | translate}} <em class="form-req">{{obrigatorio ? "*" : ""}}</em> </label>  '+
					'  <p class="input-group"> '+
					'    <input readonly="readonly" type="text" class="form-control progress" ng-model="nomeArquivo" onclick="$(\'#'+idSearch+'\')[0].click();"> '+
					'    <span class="input-group-btn"> '+
					'      <button ng-show="mostarBotaoDownload()" title="{{\'baixar-arquivo-enviado\' | translate}}" type="button" class="btn" onclick="$(\'#'+idDownload+'\')[0].click();"><i class="font15px fa fa-download"></i></button> '+
					'      <button id="'+id+'" title="{{\'selecionar-arquivo\' | translate}}. {{\'tipos-permitidos\' | translate}} {{arquivosPermitidosString()}} {{\'tamanho-maximo-arquivo\' | translate}} {{tamanhoMaximoKbytes}} KB" type="button" class="btn" onclick="$(\'#'+idSearch+'\')[0].click();"><i class="font15px fa fa-folder-open-o"></i></button> '+
					'    </span> '+
					'  </p> '+
					'  <div class="progress {{progressoFake < 100 ? \'progress-striped active\' : \'progress-success\'}}" ng-show="progressoFake"> '+
					'      <div class="bar" style="width: {{progressoFake}}%;"> '+
					'        <i ng-show="progressoFake==100" class="font15px fa fa-check"></i> '+
					'        {{progressoFake == 100 ? \'arquivo-carregado\' : \'\' | translate}} '+
					'      </div> '+
					'  </div> '+
					'  <input style="display: none;" id="'+idSearch+'"  type="file" ng-file-select="adicionarArquivo($files)" onclick="this.value = null"/> '+
					'  <a download ex-download-arquivo url="arquivos/{{valor.id}}" style="display: none;" id="'+idDownload+'"></a> '+
					'  <ex-obrigatorio mostrar-quando="mostraMsgErro()"></ex-obrigatorio> '+
					'  <div ng-show="(arquivoInvalido||tamanhoExcendente)" class="alert alert-danger">{{"arquivo-tipo-invalido" | translate}} {{arquivosPermitidosString()}} ). {{"tamanho-maximo-arquivo" | translate}} {{tamanhoMaximoKbytes/1024}} MB</div> '+

					'</div> ';

				return template;
			},
			scope: {
				rotulo: "=",
				desativado: "=",
				tiposPermitidos: "=",
				tamanhoMaximoKbytes: "=",
				descricao: "=",
				msgErroQuando: "=",
				valor: "=",
				obrigatorio : "=",
				onArquivoCarregadoFn: "=",
				onArquivoInvalidoFn: "=",
				tamanhoSpan: "=",
				exibirBotaoDownload: "="
			},
			link : link
		};
	}]);


	return app;
});