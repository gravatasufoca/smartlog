define(['msAppJs',
        'pages/geral/directives/exDownloadArquivo'], function(app) {
	'use strict';

	app.directive('exFileSelector', ['$upload',
	                                 '$rootScope',
	                                 '$timeout',
	                                 '$q',
	                                 function($upload,
	                                		 $rootScope,
	                                		 $timeout,
	                                		 $q) {
		function link(scope, element, a) {
			scope.apiArquivos = 'api/arquivos';

			var fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

			var tiposImagem = ['png', 'jpeg', 'jpg'];
			var tiposDoc = ['doc', 'pdf', 'txt','docx'];
			var tiposPlanilha = ['xls', 'xlsx'];
			var todosTipos = [].concat(tiposImagem).concat(tiposDoc).concat(tiposPlanilha);

			scope.nomeArquivo = "";
			scope.arquivoInvalido = false;
			scope.tamanhoExcendente = false;


			/**
			 * Testa se o componente deve estar desativado
			 */
			scope.disabled = function() {
				if(scope.desativado){
					return true;
				}
				return false;
			};


			/**
			 * Assiste as mudancas do campo holder principal,
			 * que repassa para o controller de origem
			 */
			scope.$watch('valor', function() {
				if(scope.valor){
					scope.nomeArquivo = scope.valor.nome;
				}
			});


			/**
			 * Verifica se o tipo do arquivo é permitido
			 * Tipos esperados:
			 * custom - Arquivo especificados no array de extensoes
			 * all    - Todos os permitidos, img, doc, sheet
			 * img    - Imagens
			 * doc    - Docs
			 * sheet  - Planilhas
			 */
			var isArquivoPermitido = function(arquivo) {
				var extensaoArquivo = arquivo.name.substring(arquivo.name.lastIndexOf('.')+1); //pra remover o .

				if(!window.geral.isEmpty(arquivo)) {
					return _.contains(scope.getExtensoesPermitidas(), extensaoArquivo);
				}

				return true;
			};


			/**
			 * Retorna as extensoes permitidas atualmente
			 */
			scope.getExtensoesPermitidas = function() {
				if(!window.geral.isEmpty(scope.tipo)) {
					if(scope.tipo === "all")
						return todosTipos;
					if(scope.tipo === "custom")
						return scope.extensoesCustom;
					if(scope.tipo === "img")
						return tiposImagem;
					if(scope.tipo === "doc")
						return tiposDoc;
					if(scope.tipo === "sheet")
						return tiposPlanilha;

					return [];
				}
			};


			/**
			 * Verifica se o tamanho é permitido
			 */
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


			/**
			 * Carrega o arquvo selecionado.
			 */
			scope.carregarArquivo = function($files) {

				if(scope.onBeforeLoadFn){
					var r= scope.onBeforeLoadFn();
					if(!r)return;
				}

				scope.arquivoInvalido = false;
				scope.tamanhoExcendente = false;

				var arquivo = $files[0];
				scope.nomeArquivo = arquivo.name;

				if(arquivo && isArquivoPermitido(arquivo) && isTamanhoPermitido(arquivo)) {
					scope.$apply(function() {
						if(scope.tipo === 'img' && scope.escalarImagem && scope.escalarImagem === true) {
							redimensionarImagem(arquivo).
							then(function(data) {
								$timeout(function() {
									scope.valor.arquivoBinario = data;
									chamarMetodoMudanca();
								});
							}, function(e) {
								console.log(e);
							});
						} else{
							$timeout(function() {
								scope.valor.arquivoBinario = arquivo;
								chamarMetodoMudanca();
							});
						}
					});
				} else {
					if(arquivo && !isArquivoPermitido(arquivo)) {
						scope.arquivoInvalido = true;
					}

					if(arquivo && !isTamanhoPermitido(arquivo)){
						scope.tamanhoExcendente = true;
					}

					chamarMetodoArquivoInvalido();
				}
			};


			/**
			 * Chama o metodo passado via parametro para executar a
			 * acao desejada quando esse componente mudar de valor
			 */
			var chamarMetodoMudanca = function() {
				if(scope.onArquivoCarregadoFn){
					scope.onArquivoCarregadoFn(scope.valor);
				}

				var situacao = {
						invalido: false,
						msgErro: "arquivo-tipo-invalido",
						msgTamMax: "tamanho-maximo-arquivo",
						tamanhoPermitido: (scope.tamanhoMaximoKbytes / 1024 )+ " MB"
				}

				console.log(situacao)
				scope.onArquivoInvalidoFn(situacao);
			};


			/**
			 * Chama o metodo passado via parametro para executar a acao
			 * desejada quando esse componente tiver um valor invalido
			 */
			var chamarMetodoArquivoInvalido = function() {
				if(scope.onArquivoInvalidoFn){
					var situacao = {
							invalido: true,
							msgErro: "arquivo-tipo-invalido",
							msgTamMax: "tamanho-maximo-arquivo",
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



			//Tratamento de imagem
			/**
			 * Redimenciona uma imagem e devolve uma promisse que responde com o
			 * Blob reduzido quando o processamento temrinar
			 */
			function redimensionarImagem(file) {
				var resizedImage = {};

				var deferred = $q.defer();

				if (file != null) {
					if (fileReaderSupported && file.type.indexOf('image') > -1) {
						var fileReader = new FileReader();

						fileReader.onload = function(e) {
							var img = new Image();
							img.onload = function(e) {
								var escala = calcularEscala(80, img.width, img.height); //externalizar o 80
								var canvas = downScaleImage(this, escala);

								resizedImage.dataUrl = canvas.toDataURL();

								deferred.resolve(resizedImage);
							};

							img.src = e.target.result;
						};

						fileReader.readAsDataURL(file);
					}
				} else {
					deferred.reject("Imagem inválida");
				}

				return deferred.promise;
			};


			/**
			 * Calcula a escala que uma imagem terá
			 */
			function calcularEscala(max, currW, currH){
				var scale = 1;
				var newW = currW, newH = currH;

				while(newW > max || newH > max) {
					scale = scale - 0.01;
					newW = currW * scale;
					newH = currH * scale;
				}

				return scale;
			};


			// scales the image by (float) scale < 1
			// returns a canvas containing the scaled image.
			function downScaleImage(img, scale) {
				var imgCV = document.createElement('canvas');
				var imgCtx = imgCV.getContext('2d');
				imgCV.width = img.width;
				imgCV.height = img.height;
				imgCtx.fillStyle = '#fff';  /// set white fill style
				imgCtx.fillRect(0, 0, imgCV.width, imgCV.height);
				imgCtx.drawImage(img, 0, 0);
				return downScaleCanvas(imgCV, scale);
			}

			// scales the canvas by (float) scale < 1
			// returns a new canvas containing the scaled image.
			function downScaleCanvas(cv, scale) {
				if (!(scale < 1) || !(scale > 0)) throw ('scale must be a positive number <1 ');
				scale = normaliseScale(scale);
				var sqScale = scale * scale; // square scale =  area of a source pixel within target
				var sw = cv.width; // source image width
				var sh = cv.height; // source image height
				var tw = Math.floor(sw * scale); // target image width
				var th = Math.floor(sh * scale); // target image height
				var sx = 0, sy = 0, sIndex = 0; // source x,y, index within source array
				var tx = 0, ty = 0, yIndex = 0, tIndex = 0; // target x,y, x,y index within target array
				var tX = 0, tY = 0; // rounded tx, ty
				var w = 0, nw = 0, wx = 0, nwx = 0, wy = 0, nwy = 0; // weight / next weight x / y
				// weight is weight of current source point within target.
				// next weight is weight of current source point within next target's point.
				var crossX = false; // does scaled px cross its current px right border ?
				var crossY = false; // does scaled px cross its current px bottom border ?
				var sBuffer = cv.getContext('2d').
				getImageData(0, 0, sw, sh).data; // source buffer 8 bit rgba
				var tBuffer = new Float32Array(3 * tw * th); // target buffer Float32 rgb
				var sR = 0, sG = 0,  sB = 0; // source's current point r,g,b

				for (sy = 0; sy < sh; sy++) {
					ty = sy * scale; // y src position within target
					tY = 0 | ty;     // rounded : target pixel's y
					yIndex = 3 * tY * tw;  // line index within target array
					crossY = (tY !== (0 | ( ty + scale )));
					if (crossY) { // if pixel is crossing botton target pixel
						wy = (tY + 1 - ty); // weight of point within target pixel
						nwy = (ty + scale - tY - 1); // ... within y+1 target pixel
					}
					for (sx = 0; sx < sw; sx++, sIndex += 4) {
						tx = sx * scale; // x src position within target
						tX = 0 | tx;    // rounded : target pixel's x
						tIndex = yIndex + tX * 3; // target pixel index within target array
						crossX = (tX !== (0 | (tx + scale)));
						if (crossX) { // if pixel is crossing target pixel's right
							wx = (tX + 1 - tx); // weight of point within target pixel
							nwx = (tx + scale - tX - 1); // ... within x+1 target pixel
						}
						sR = sBuffer[sIndex    ];   // retrieving r,g,b for curr src px.
						sG = sBuffer[sIndex + 1];
						sB = sBuffer[sIndex + 2];
						if (!crossX && !crossY) { // pixel does not cross
							// just add components weighted by squared scale.
							tBuffer[tIndex    ] += sR * sqScale;
							tBuffer[tIndex + 1] += sG * sqScale;
							tBuffer[tIndex + 2] += sB * sqScale;
						} else if (crossX && !crossY) { // cross on X only
							w = wx * scale;
							// add weighted component for current px
							tBuffer[tIndex    ] += sR * w;
							tBuffer[tIndex + 1] += sG * w;
							tBuffer[tIndex + 2] += sB * w;
							// add weighted component for next (tX+1) px
							nw = nwx * scale
							tBuffer[tIndex + 3] += sR * nw;
							tBuffer[tIndex + 4] += sG * nw;
							tBuffer[tIndex + 5] += sB * nw;
						} else if (!crossX && crossY) { // cross on Y only
							w = wy * scale;
							// add weighted component for current px
							tBuffer[tIndex    ] += sR * w;
							tBuffer[tIndex + 1] += sG * w;
							tBuffer[tIndex + 2] += sB * w;
							// add weighted component for next (tY+1) px
							nw = nwy * scale
							tBuffer[tIndex + 3 * tw    ] += sR * nw;
							tBuffer[tIndex + 3 * tw + 1] += sG * nw;
							tBuffer[tIndex + 3 * tw + 2] += sB * nw;
						} else { // crosses both x and y : four target points involved
							// add weighted component for current px
							w = wx * wy;
							tBuffer[tIndex    ] += sR * w;
							tBuffer[tIndex + 1] += sG * w;
							tBuffer[tIndex + 2] += sB * w;
							// for tX + 1; tY px
							nw = nwx * wy;
							tBuffer[tIndex + 3] += sR * nw;
							tBuffer[tIndex + 4] += sG * nw;
							tBuffer[tIndex + 5] += sB * nw;
							// for tX ; tY + 1 px
							nw = wx * nwy;
							tBuffer[tIndex + 3 * tw    ] += sR * nw;
							tBuffer[tIndex + 3 * tw + 1] += sG * nw;
							tBuffer[tIndex + 3 * tw + 2] += sB * nw;
							// for tX + 1 ; tY +1 px
							nw = nwx * nwy;
							tBuffer[tIndex + 3 * tw + 3] += sR * nw;
							tBuffer[tIndex + 3 * tw + 4] += sG * nw;
							tBuffer[tIndex + 3 * tw + 5] += sB * nw;
						}
					} // end for sx
				} // end for sy

				// create result canvas
				var resCV = document.createElement('canvas');
				resCV.width = tw;
				resCV.height = th;
				var resCtx = resCV.getContext('2d');
				var imgRes = resCtx.getImageData(0, 0, tw, th);
				var tByteBuffer = imgRes.data;
				// convert float32 array into a UInt8Clamped Array
				var pxIndex = 0; //
				for (sIndex = 0, tIndex = 0; pxIndex < tw * th; sIndex += 3, tIndex += 4, pxIndex++) {
					tByteBuffer[tIndex] = 0 | ( tBuffer[sIndex]);
					tByteBuffer[tIndex + 1] = 0 | (tBuffer[sIndex + 1]);
					tByteBuffer[tIndex + 2] = 0 | (tBuffer[sIndex + 2]);
					tByteBuffer[tIndex + 3] = 255;
				}
				// writing result to canvas.
				resCtx.putImageData(imgRes, 0, 0);
				return resCV;
			}

			function polyFillPerfNow() {
				window.performance = window.performance ? window.performance : {};
				window.performance.now =  window.performance.now ||  window.performance.webkitNow ||  window.performance.msNow ||
				window.performance.mozNow || Date.now ;
			};

			function log2(v) {
				// taken from http://graphics.stanford.edu/~seander/bithacks.html
				var b =  [ 0x2, 0xC, 0xF0, 0xFF00, 0xFFFF0000 ];
				var S =  [1, 2, 4, 8, 16];
				var i=0, r=0;

				for (i = 4; i >= 0; i--) {
					if (v & b[i])  {
						v >>= S[i];
						r |= S[i];
					}
				}
				return r;
			}

			// normalize a scale <1 to avoid some rounding issue with js numbers
			function normaliseScale(s) {
				if (s>1) throw('s must be <1');
				s = 0 | (1/s);
				var l = log2(s);
				var mask = 1 << l;
				var accuracy = 4;
				while(accuracy && l) { l--; mask |= 1<<l; accuracy--; }
				return 1 / ( s & mask );
			}
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
					'      <button id="'+id+'" title="{{\'selecionar-arquivo\' | translate}}" type="button" class="btn" onclick="$(\'#'+idSearch+'\')[0].click();"><i class="font15px fa fa-folder-open-o"></i></button> '+
					'    </span> '+
					'  </p> '+
					'  <input style="display: none;" id="'+idSearch+'"  type="file" ng-file-select="carregarArquivo($files)" onclick="this.value = null"/> '+
					'  <a download ex-download-arquivo url="arquivos/{{valor.id}}" style="display: none;" id="'+idDownload+'"></a> '+
					'  <ex-obrigatorio mostrar-quando="mostraMsgErro()"></ex-obrigatorio> '+
					'  <div ng-show="(arquivoInvalido||tamanhoExcendente)" class="alert alert-danger" style="word-break: break-word;">'+
					'      <div ng-show="arquivoInvalido">{{msgArquivoInvalido ? msgArquivoInvalido : "arquivo-tipo-invalido" | translate}} Selecione arquivos extens\u00e3o: {{getExtensoesPermitidas()}} <br/></div> '+
					'      <div ng-show="tamanhoExcendente">{{"tamanho-maximo-arquivo" | translate}} {{tamanhoMaximoKbytes/1024}} MB</div> '+
					'  </div> '+
					'</div> ';

				return template;
			},
			scope: {
				rotulo: "=",
				desativado: "=",
				tipo: "=",
				extensoesCustom : "=",
				tamanhoMaximoKbytes: "=",
				descricao: "=",
				msgErroQuando: "=",
				valor: "=",
				obrigatorio : "=",
				onArquivoCarregadoFn: "=",
				onArquivoInvalidoFn: "=",
				tamanhoSpan: "=",
				msgArquivoInvalido: "=",
				escalarImagem: "=",
				onBeforeLoadFn: "="
			},
			link : link
		};
	}]);


	return app;
});
