define(['msAppJs'], function(app) {
	'use strict';


	/**
	 * Filtro para o valor a ser exibido em moeda Real
	 */
	app.filter('real', function() {
		return function(input) {
			if(input) {
				if (typeof input === 'string' && input.contains("R$")) {
					input = input.realToFloat();
				}
				return parseFloat(input+"").formatReal();
			}
			return "R$ 0,00";
		};
	});


	/**
	 * Filtro para o valor de cnpj a ser exibido
	 */
	app.filter('cnpj', [function() {
		return function(input) {
			if(input) {
				return window.geral.aplicarMascara(input, '00.000.000/0000-00');
			} else {
				return "";
			}
		};
	}]);


	/**
	 * Filtro para o valor de cpf a ser exibido
	 */
	app.filter('cpf', [function() {
		return function(input) {
			if(input) {
				return window.geral.aplicarMascara(input, '000.000.000-00');
			} else {
				return "";
			}
		};
	}]);


	/**
	 * Filtro para o valor de cep a ser exibido
	 */
	app.filter('cep', [function() {
		return function(input) {
			if(input) {
				return window.geral.aplicarMascara(input, '00.000-000');
			} else {
				return "";
			}
		};
	}]);


	/**
	 * Filtro para o valor de telefone a ser exibido
	 */
	app.filter('fone', [function() {
		return function(input) {
			if(input) {
				var tamanho = (input+"").length;

				if(tamanho === 8) {
					return window.geral.aplicarMascara(input, '0000-0000');
				} else if(tamanho === 9) {
					return window.geral.aplicarMascara(input, '00000-0000');
				}
			} else {
				return "";
			}
		};
	}]);


	/**
	 * Filtro para o valor de telefone a ser exibido
	 */
	app.filter('dddFone', [function() {
		return function(input) {
			if(input) {
				var tamanho = (input+"").length;

				if(tamanho === 10) {
					return window.geral.aplicarMascara(input, '(00) 0000-0000');
				} else if(tamanho === 11) {
					return window.geral.aplicarMascara(input, '(00) 00000-0000');
				}
			} else {
				return "";
			}
		};
	}]);


	/**
	 * Filtro para escapar os caracteres especiais de uma data string
	 */
	app.filter('encodeURI', [function() {
		return function(input) {
			if(input) {
				return encodeURI(input);
			} else {
				return "";
			}
		};
	}]);



	/**
	 * Filtro para escapar os caracteres especiais de uma data string
	 */
	app.filter('encodeURIComponent', [function() {
		return function(input) {
			if(input) {
				return encodeURIComponent(input);
			} else {
				return "";
			}
		};
	}]);


	/**
	 * Filtro para pesquisar dentro de arrays
	 * Uso: $filter('customFilter1')($scope.planosMidiaFiltrados, {searchAttr: 'dataPlano', equalTo: $scope.filtro.dataPlano.datetimeToString()});
	 */
	app.filter('customFilter1', [function () {
		return function (items, search) {
			console.log(items, search);

			var result = [];
			angular.forEach(items, function (jsonObj, key) {
				for (var attrAtual in jsonObj) {
					if (attrAtual === search.searchAttr) {
						if(window.geral.isEmpty(search.compareId) || search.compareId === false) {
							if (jsonObj[attrAtual] === search.equalTo) {
								result.push(jsonObj);
							}
						} else {
							if (jsonObj[attrAtual].id === search.equalTo.id) {
								result.push(jsonObj);
							}
						}
					}
				};
			});
			
			return result;
		}
	}]);




	/**
	 * Filtro para mostrar um traco caso o elemento seja null ou undefined
	 */
	app.filter('dash', [function() {
		return function(input) {
			if(input) {
				return input;
			} else {
				return "-";
			}
		};
	}]);

	return app;
});