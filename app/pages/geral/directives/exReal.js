define(['msAppJs'], function(app) {
	'use strict';

	/**
	 * Aplica a formatação em real no campo
	 */
	var formataValor = function(val) {
		var valFloat = null;
		val = (val+"").extractNumbers(",.");

		if(val.count(",") === 1){
			val = val.replace(",",".");
		}

		valFloat = parseFloat(val);

		return valFloat.formatReal();
	};


	/**
	 * Verifica se um campo já esta formatado
	 */
	var isFormatado = function(val) {
		if(val && val != null) {
			return (val+"").indexOf("R$") != -1;
		} else {
			false
		}
	};


	/**
	 * Diretiva para aplicar mascara em inputs de moeda em real
	 */
	app.directive('exReal', ["$timeout", function ($timeout) {
		return {
			restrict: 'C', 
			require: 'ngModel',
			link: function (scope, element, attrs, ngModel) {
				var maxvalue = attrs.maxlength ? attrs.maxlength : 12;
				var tamanhoInteiro = maxvalue - 3; //3 = 2 casas decimais, 1 ponto ou virgula

				/**
				 * Listener para aplicar a mascara assim que a diretiva for carregada 
				 */
				var cancelarWatchInicial = scope.$watch(attrs.ngModel, function(newValue, oldValue) {
					if (newValue != undefined && newValue != null && !isFormatado(newValue)) {
						var val = formataValor(newValue);
						ngModel.$setViewValue(val);
						ngModel.$render();
						cancelarWatchInicial();
					}
				});


				/**
				 * Binda o evento keypress
				 */
				element.bind('keypress', function(e) {
					var tecla = e.keyCode || e.which;

					if(tecla != 9) { //tab
						$timeout(function() {
							var val = (ngModel.$viewValue+"").extractNumbers(",.");
							var qteVirgulaPonto = val.count(",") + val.count("\\.");

							while(qteVirgulaPonto > 1){
								val = val.replace("\.", "").replace(",", ""); //removendo de um a um
								qteVirgulaPonto = val.count(",") + val.count("\\.");
							}

							if(val.length > tamanhoInteiro && qteVirgulaPonto == 0){
								val = val.substring(0, tamanhoInteiro);
							}

							ngModel.$setViewValue(val);
							ngModel.$render();
						}, 1);
					};
				});


				/**
				 * Remove o drop dentro do campo, assim o usuario nao poderia arrastar e soltar texto dentro do campo
				 */
				element.bind('drop', function(e) {
					return false;
				});


				/**
				 * Binda o evento blur para aplicar a mascara quando o campo perder o foco
				 */
				element.bind("blur", function(event) {
					if(ngModel.$viewValue) {
						var val = formataValor(ngModel.$viewValue);
						
						if(val.realToFloat() === 0 && (attrs.ignorarZero && attrs.ignorarZero === 'true')) {
							val = "";
						}
						
						scope.$apply(function() {
							ngModel.$setViewValue(val);
							ngModel.$render();
						});
					}
				});


				/**
				 * Binda o focus para remover a mascara quando o campo estiver ativo
				 */
				element.bind("focus", function(event) {
					cancelarWatchInicial(); //cancela o watch

					if(ngModel.$viewValue) {
						var val = (ngModel.$viewValue+"").extractNumbers(",");

						if(val === "0,00") {
							val = "";
						} 

						if(val.contains(",00")) {
							val = val.substring(0, val.indexOf(",00"));
						} 

						ngModel.$setViewValue(val);
						ngModel.$render();
						scope.$apply();
					}
				});
			}
		};
	}]);

	return app;
});