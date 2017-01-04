define(['msAppJs'], function(app) {

	//////////////////////////PLUGINS


    /**
	 * Plugin que faz a tela rolar para determinado componente visivel na tela
	 */
	$.fn.scrollTo = function() {
		var isVisibleOnScreen = function(elem) {
			var docViewTop = $(window).scrollTop();
			var docViewBottom = docViewTop + $(window).height();
			var elemTop = $(elem).offset().top;
			var elemBottom = elemTop + $(elem).height();

			return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
		};

		if(!isVisibleOnScreen(this)){
			$('html, body').animate({
				scrollTop: $(this).offset().top + 'px'
			}, 'fast');
			return this; // for chaining...
		}
	};


	/**
	 * Plugin para formatação de numeros
	 * Number.prototype.format(n, x, s, c)
	 * 
	 * @param integer n: tamanho do decimal, ex: 2
	 * @param integer x: tamanho dos milhares, sessao, ex: 3
	 * @param misto   s: delimitadores da sessao, ex: .
	 * @param misto   c: delimitador do decimal, ex: ,
	 */
	Number.prototype.format = function(n, x, s, c) {
		var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')', num = this.toFixed(Math.max(0, ~~n));
		return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
	};


	/**
	 * Plugin para formatação de numeros
	 * Formata um numero para Real R$
	 */
	Number.prototype.formatReal = function() {
		var real = "R$ ";
		real += this.format(2, 3, '.', ','); 
		return real;
	};


	/**
	 * Plugin para extração de numeros de stings, retorna uma string contendo apenas numeros e os outros caracteres escapados
	 * @param misto s: escapar caracteres, ex: -.,, _-, , -, _-
	 */
	String.prototype.extractNumbers = function(s) {
		var patternBase = "[^0-9{*}]";

		if(s) {
			patternBase = patternBase.replace("{*}", s);
		} else {
			patternBase = patternBase.replace("{*}", "");
		}

		return this.replace(new RegExp(patternBase,"g"), "");
	};


	/**
	 * Plugin para converter reais formatados para float
	 */
	String.prototype.realToFloat = function() {
		var val = parseFloat(this.extractNumbers(",").replace(",","."));

		if(isNaN(val)) {
			val = 0;
		}

		return val;
	};

	/**
	 * Plugin para converter reais formatados para float
	 */
	Number.prototype.realToFloat = function() {
		return this+"".realToFloat();
	};


	/**
	 * Metodo utilitario para verificar validade de emails
	 */
	String.prototype.isValidEmail = function() {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(this);
	}

    String.prototype.tamanhoArquivo = function() {
		var valor= parseInt(this)
        if(valor>0){
        	return Math.floor(valor/1000)+" KB";
		}
		return "";
    }

	/**
	 * Plugin para contar a quantidade do caracter informado presente na string
	 * @param misto c: caracter a ser contado, ex: -.,, _-, , -, _-
	 */
	String.prototype.count = function(c) {
		if(c) {
			var resultado = this.match(new RegExp(c, 'g'));

			if(resultado && resultado != null) {
				return resultado.length;
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	};


	/**
	 * Plugin para verificar se uma determinada string contem dado valor
	 */
	String.prototype.contains = function(c) {
		if(c) {
			return this.indexOf(c) !== -1;
		} else {
			return 0;
		}
	};


    String.prototype.acronomo = function (qtd) {
        if (this != null && this.length > 0) {
            var matches = this.match(/\b(\w)/g);
            var acronym = matches.join('');
            if (acronym.length >= qtd)
                return acronym.substring(0, qtd);
            return acronym;
        }
        return "";
    };

	/**
	 * Converte strings para date
	 */
	String.prototype.stringToDatetime = function() {
		return moment(this,'YYYY-MM-DDTHH:mm:ss')._d;
	};


	/**
	 * Faz um replace all para string
	 */
	String.prototype.replaceAll = function (from, to) {
		var escapeRegExp = function escapeRegExp(string) {
			return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		}

		return this.replace(new RegExp(escapeRegExp(from), 'g'), to)
	};


	/**
	 * Converte datas para string
	 */
	Date.prototype.dateToString = function() {
		return moment(this).format('YYYY-MM-DD');
	};


	/**
	 * Converter datetime to string
	 * @param d
	 * @returns
	 */
	Date.prototype.datetimeToString = function(d) {
		return moment(this).format('YYYY-MM-DDTHH:mm:ss');
	};

    Date.prototype.format = function(pattern) {
        return moment(this).format(pattern);
    };


	//////////////////////////////////////////////////////// UTILIDADES
	function Geral () {

		/**
		 * Remove mascaras de valores formatados
		 */
		Geral.prototype.removerMascara = function(valorMascarado) {
			var exp = /\-|\.|\/|\(|\)| /g;
			return valorMascarado.replace(exp, ""); 
		};


		/***
		 * Formatador generico.
		 * Ex:
		 * aplicarMascara(cnpj, '00.000.000/0000-00');
		 */
		Geral.prototype.aplicarMascara = function(valor, mascara) { 
			var isCuringaMascara; 
			var posicaoCampo = 0;    
			var novoValorCampo = "";
			var valorSemMascara = this.removerMascara(valor);
			var tamanhoMascara = valorSemMascara.length;; 

			for(var i = 0 ; i <= tamanhoMascara ; i++) { 
				isCuringaMascara = ((mascara.charAt(i) == "-") || (mascara.charAt(i) == ".") || (mascara.charAt(i) == "/"));
				isCuringaMascara = isCuringaMascara || ((mascara.charAt(i) == "(") || (mascara.charAt(i) == ")") || (mascara.charAt(i) == " "));

				if (isCuringaMascara) { 
					novoValorCampo += mascara.charAt(i); 
					tamanhoMascara++;
				}else { 
					novoValorCampo += valorSemMascara.charAt(posicaoCampo); 
					posicaoCampo++; 
				};              
			}

			return novoValorCampo; 
		};


		/**
		 * Verifica se um valor é considerado vazio
		 */
		Geral.prototype.isEmpty = function(valor, zeroIsEmpty) {
			if(valor === undefined) {
				return true;
			} else if (valor === null) {
				return true;
			} else if (typeof valor == 'number') {
				if(zeroIsEmpty && zeroIsEmpty === true && valor === 0) {
					return true;
				}
			} else if (typeof valor === 'string' && valor.contains("R$")) { //string real
				if (zeroIsEmpty && zeroIsEmpty === true && valor.realToFloat() === 0) {
					return true;
				}
			} else if (typeof valor === 'string' || Object.prototype.toString.call(valor) === '[object Array]') { //data oou string
				if (valor.length == 0) {
					return true;
				}
			}

			return false;
		}


		/**
		 * Converte de dataURL para Blob
		 */
		Geral.prototype.dataURLtoBlob = function(dataURL) {
			var BASE64_MARKER = ';base64,';

			var parts = dataURL.split(BASE64_MARKER);
			var contentType = parts[0].split(':')[1];
			var raw = window.atob(parts[1]);
			var rawLength = raw.length;

			var uInt8Array = new Uint8Array(rawLength);

			for (var i = 0; i < rawLength; ++i) {
				uInt8Array[i] = raw.charCodeAt(i);
			}

			return new Blob([uInt8Array], {type: contentType});
		}

		Geral.prototype.randomInt=function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        $.fn.scrollEnd = function(callback, timeout) {
            $(this).scroll(function(){
                var $this = $(this);
                if ($this.data('scrollTimeout')) {
                    clearTimeout($this.data('scrollTimeout'));
                }
                $this.data('scrollTimeout', setTimeout(callback,timeout));
            });
        };

	}

	window.geral = new Geral();

	return app;
});