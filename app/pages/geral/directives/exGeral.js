define(['msAppJs'], function(app) {
	'use strict';

	/**
	 * Pisca
	 */
	app.directive('exBlink', ["$interval", function($interval) { //teste, traz a bebiba que pisca pisca pisca pisca.
		return {
			restrict: 'E',
			link: function(scope, element, attrs) {
				var visivel = true;
				$interval(function() {
					visivel = !visivel;
					element.css('visibility', visivel ? '' : 'hidden');
				}, 1000);
			}
		};
	}]);


	/**
	 * Faz aquele lazy loading em ngTables
	 */
	app.directive('loadingContainer', function () {
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, element, attrs) {
				var loadingLayer = angular.element('<div class="loading"></div>');
				element.append(loadingLayer);
				element.addClass('loading-container');
				scope.$watch(attrs.loadingContainer, function(value) {
					loadingLayer.toggleClass('ng-hide', !value);
				});
			}
		};
	});



	app.directive('exObrigatorio', function() {
		return {
			restrict: 'E',
			replace: true,
			link : function(scope, e, a) {
			},
			template: function(element, a) {
				var template =
					'<div ng-show="mostrarQuando" class="alert alert-danger">{{"obrigatorio" | translate}}</div>';
				return template;
			},
			scope: {
				mostrarQuando: "="
			}
		};
	});


	app.directive('exInvalido', function() {
		return {
			restrict: 'E',
			replace: true,
			link : function(scope, e, a) {
			},
			template: function(element, a) {
				var template =
					'<div ng-show="mostrarQuando" class="alert alert-danger">{{"invalido" | translate}}</div>';
				return template;
			},
			scope: {
				mostrarQuando: "="
			}
		};
	});


	/**
	 * Diretiva que serve para corrigir o comportamento padrão dos gerenciadores de senha, utilizados pelos usuarios,
	 * para fazer autocomplete de formularios de autenticacao.
	 * Sem essa diretiva, o chaveiro iria completar os campos de usuario e senha mas o angular não iria detectar a mudança,
	 * com isso quando o usuario tentasse fazer o login, seria avisado que os dados obrigatorios nao estavam preenchidos.
	 */
	app.directive('exAutofillFormFix', ["$timeout", function ($timeout) {
		return function (scope, element, attrs) {
			element.prop('method', 'post');
			if (attrs.ngSubmit) {
				$timeout(function () {
					element
					.unbind('submit')
					.bind('submit', function (event) {
						event.preventDefault();
						element
						.find('input, textarea, select')
						.trigger('input')
						.trigger('change')
						.trigger('keydown');
						scope.$apply(attrs.ngSubmit);
					});
				});
			}
		};
	}]);


	/**
	 * Diretiva que serve para desabilitar todos os campos dentro de um bloco
	 */
	app.directive('exDisableBlock', ["$timeout", function ($timeout) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				if(attrs.exDisableBlock === "true") {
					var desativaElementos = function () {
						element
						.find('input, textarea, select, button, a').filter(":not(:disabled)")
						.prop( "disabled", true);
					}

					$timeout(desativaElementos, 500);
					//$timeout(desativaElementos, 1000); //para garantir
					//$timeout(desativaElementos, 1500); //para garantir
					$timeout(desativaElementos, 4000); //para garantir mesmo
				}
			}
		}
	}]);


	/**
	 * Remove aquele espaço em branco da paginaçao em branco
	 */
	app.directive('exTableNoPaginationFix', ["$interval", function($interval) {
		return {
			restrict: 'A',
			link: function(scope, elm, attrs) {

				var clearInterval = $interval(function() {
					var div = elm.parent().children()[1];

					if(div.attributes["ng-include"].value === 'templates.pagination') {
						angular.element(div).remove();
						$interval.cancel(clearInterval);
					}
				}, 100);
			}
		};
	}]);


	/**
	 * Motitora alteraçoes no formulario
	 */
	app.directive('exFormularioAlterado', ["$timeout", function ($timeout) {
		return {
			restrict: 'A',
			replace: true,
			link : function (scope, element, attrs) {
				element
				.find('input, textarea, select')
				.bind('keypress change', function (event) {
					$timeout(function() {
//						console.log("alterou... ", event);
						scope.exFormularioAlterado = true;
						scope.$apply();
					}, 100);
				});
			},
			scope: {
				exFormularioAlterado: "=",
			}
		};
	}]);


	/**
	 * Para imagens com carregamento sobre demanda
	 */
	app.directive('exLazyImgSrc', ["$timeout", function ($timeout) {
		return {
			restrict: 'A',
			replace: true,
			link : function (scope, element, attrs) {
				scope.$watch('exLazyImgSrc', function(oldVal, newVal) {
					$timeout(function() {
						element[0].src = scope.exLazyImgSrc;
					}, 100);
				});
			},
			scope: {
				exLazyImgSrc: "=",
			}
		};
	}]);


   	app.directive('scrolly',["$timeout", function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var raw = element[0];

                if(element.attr("reverse")==null){
                    scope.reverse=false;
                }

                if (scope.objeto != null && scope.reverse) {
					scope.$watch("objeto",function (a,b) {
						if(a!=null && b!=null && b.length==0) {
                            raw.scrollTop = raw.scrollHeight;
                            element.attr("scroll",raw.scrollHeight);
                            element.attr("scrollheight",raw.scrollHeight);
                        }

                    });
                }

                var scrollNormal=function () {
                    if (raw.scrollTop + raw.offsetHeight== raw.scrollHeight) { //at the bottom

                        if(scope.onEnd!=null){
                        	if(scope.loading!=null){
                        		scope.loading=true;
							}
                            $timeout(function () {
                                scope.onEnd(element);
                            },scope.timeout!=null?scope.timeout:0);
                        }
                    }
                };

                var scrollReverse=function () {
                    if (raw.scrollTop ==0) { //at the bottom

                        if(scope.onEnd!=null){
                            if(scope.loading!=null){
                                scope.loading=true;
                            }
                            $timeout(function () {
                                scope.onEnd(element);
                            },scope.timeout!=null?scope.timeout:0);
                        }
                    }
                };

                element.bind('scroll', function () {
					if(scope.scrolling.scroll) {
                        // console.log("top:"+raw.scrollTop+" height: "+raw.scrollHeight);
                        if (!scope.reverse) {
                            scrollNormal();
                        } else {
                            scrollReverse();
                        }
                    }
                })
            },
			scope:{
            	onEnd:"=",
				reverse:"=?",
				objeto:"=?",
				loading:"=?",
                scrolling:"="
			}
        }
    }]);

    app.directive('myModalPosition', function ($window, $timeout) {
        return {
            link: link
        }

        function link ($scope, element, attrs) {
            var updateMargin = function () {
                if (Config.Mobile &&
                    $(element[0].parentNode.parentNode.parentNode).hasClass('mobile_modal')) {
                    return
                }
                var height = element[0].parentNode.offsetHeight
                var modal = element[0].parentNode.parentNode.parentNode
                var bottomPanel = $('.media_modal_bottom_panel_wrap', modal)[0]
                var contHeight = modal.offsetHeight - (bottomPanel && bottomPanel.offsetHeight || 0)

                if (height < contHeight) {
                    $(element[0].parentNode).css('marginTop', (contHeight - height) / 2)
                } else {
                    $(element[0].parentNode).css('marginTop', '')
                }

                if (attrs.animation != 'no') {
                    $timeout(function () {
                        $(element[0].parentNode).addClass('modal-content-animated')
                    }, 300)
                }
            }

            $($window).on('resize', updateMargin)

            $scope.$on('ui_height', function (e, sync) {
                if (sync) {
                    updateMargin()
                } else {
                }
            })
        }
    });


    app.directive('exConectado', ["gravacoesService","$timeout",function (gravacoesService, $timeout) {
        return {
            link: link
        }

        function link ($scope, element, attrs) {

        }
    }]);


    return app;
});