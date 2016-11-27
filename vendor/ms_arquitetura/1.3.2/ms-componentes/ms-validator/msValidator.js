define([
        'angularValidator',
        'utils/cpf_cnpj/cpf_cnpj.min',
        'moment'
        ], 
		function() {
			'use strict';
			try {
				var msValidator =  angular.module('msValidator', ['validator']);
                                
                                /*
                                 * Configurando o modulo para permitir LazyLoading de providers e as respectivas validações
                                 */
                                msValidator.config(['$controllerProvider', '$provide', '$compileProvider', '$validatorProvider', '$sceProvider',
                                                    function($controllerProvider, $provide, $compileProvider, $validatorProvider, $sceProvider){

                                        
                                        msValidator._directive = msValidator.directive;
                                        msValidator.directive = function( name, constructor ) {
                                            $compileProvider.directive( name, constructor );
                                            return( this );

                                        };  
                                        
                                        msValidator._factory = msValidator.factory;
                                        msValidator.factory = function( name, constructor ) {
                                            $provide.factory( name, constructor );
                                            return( this );

                                        };
                                        
                                        function showError(element, attrs, message) {
                                            
                                            if(attrs.type == 'radio' || attrs.type == 'checkbox') {
                                                element = angular.element(element[0].parentElement);
                                            }
                                            
                                            var id = element[0].id;
                                            var newElement = angular.element('<div id="' + id + '-error-message" class="alert alert-danger">' + message + '</div>');
                                            
                                            if(element.hasClass('has-error')) {
                                                angular.element('#' + id + '-error-message').remove();
                                            }
                                            else {
                                                element.addClass('has-error');
                                            }
                                            
                                            element.after(newElement);
                                        }
                                        
                                        function removeError(element, attrs) {
                                            if(attrs.type == 'radio' || attrs.type == 'checkbox') {
                                                element = angular.element(element[0].parentElement);
                                            }
                                            var id = element[0].id;
                                            angular.element('#' + id + '-error-message').remove();
                                        }
                                        
                                        /*
                                         * Regras de validação padrões
                                         */
                                        
                                        /**
                                         * REQUIRED
                                         */
                                        
                                        $validatorProvider.register('required', {
                                            invoke: 'watch',
                                            validator: /.+/,
                                            error: function(value, scope, element, attrs, $injector){
                                                showError(element, attrs,'Este campo é obrigatório');
                                            },
                                            success: function(value, scope, element, attrs) {
                                                removeError(element, attrs);
                                            }
                                        });
                                                        
                                        
                                        /**
                                         * NUMBER
                                         */
                                        $validatorProvider.register('number', {
                                            invoke: 'watch',
                                            validator: /^[-+]?[0-9]*[\.]?[0-9]*$/,
                                            error: function(value, scope, element, attrs){
                                                showError(element, attrs,'Este campo só aceita números');
                                            },
                                            success: function(value, scope, element, attrs) {
                                                removeError(element, attrs);
                                            }
                                        });
                                        
                                        /**
                                         * EMAIL
                                         */
                                        $validatorProvider.register('email', {
                                            invoke: 'watch',
                                            validator: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                            error: function(x, scope, element, attrs){
                                                showError(element, attrs,'Informe um email correto');
                                            },
                                            success: function(x, scope, element, attrs) {
                                                removeError(element, attrs);
                                            }
                                        });
                                        
                                        /*
                                         * URL
                                         */
                                        $validatorProvider.register('url', {
                                            invoke: 'blur',
                                            validator: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                                            error: function(value, scope, element, attrs){
                                                showError(element, attrs,'Informe uma URL válida');
                                            },
                                            success: function(value, scope, element, attrs) {
                                                removeError(element, attrs);
                                            }
                                        });
                                        
                                        /*
                                         * CPF
                                         */
                                        $validatorProvider.register('cpf', {
                                            invoke: 'blur',
                                            validator: function(value, scope, element, attrs, $injector) {
                                                return (!value) ? true : window.CPF.isValid(value);
                                            },
                                            error: function(value, scope, element, attrs){
                                                showError(element, attrs, 'Informe um CPF válido');
                                            },
                                            success: function(value, scope, element, attrs) {
                                                removeError(element, attrs);
                                            }
                                        });
                                        
                                        /*
                                         * CNPJ
                                         */
                                        $validatorProvider.register('cnpj', {
                                            invoke: 'blur',
                                            validator: function(value, scope, element, attrs, $injector) {
                                                return (!value) ? true : window.CNPJ.isValid(value);
                                            },
                                            error: function(value, scope, element, attrs){
                                                showError(element, attrs, 'Informe um CNPJ válido.');
                                            },
                                            success: function(value, scope, element, attrs) {
                                                removeError(element, attrs);
                                            }
                                        });
                                        
                                        /*
                                         * Função de parser de data
                                         */
                                        
                                        function parseDate(scope, toParse, $injector) {
                                            var $parse = $injector.get('$parse');
                                            var parseGetter = $parse(toParse);
                                            return parseGetter(scope);
                                        }
                                        
                                        /*
                                         * DateLte
                                         * Deve-se informar o valor limite com o atributo end-date
                                         */
                                        $validatorProvider.register('dateLte', {
                                            invoke: 'blur',
                                            validator: function(value, scope, element, attrs, $injector) {
                                                
                                                if(attrs.max) {
                                                    var date = moment(value);
                                                    scope.dateLte = parseDate(scope, attrs.max, $injector);
                                                    var limit = moment(scope.dateLte);
                                                    return  (date.diff(limit, 'days', true) <= 0);
                                                }
                                                else
                                                {
                                                    throw 'Não foi informada uma data fim para validação "menor ou igual a - (dateLte)".';
                                                }
                                            },
                                            error: function(value, scope, element, attrs){
                                                var message = (attrs.validatorMessage) ? attrs.validatorMessage : 'Informe uma data menor ou igual a ' + moment(scope.dateLte).format('DD/MM/YYYY'); 
                                                showError(element, attrs, message);
                                            },
                                            success: function(value, scope, element, attrs) {
                                                removeError(element, attrs);
                                            }
                                        });
                                        
                                        /*
                                         * Dategte
                                         * Deve-se informar o valor limite com o atributo init-date
                                         */
                                        $validatorProvider.register('dateGte', {
                                            invoke: 'blur',
                                            validator: function(value, scope, element, attrs, $injector) {
                                                
                                                if(attrs.min) {
                                                    var date = moment(value);
                                                    scope.dateGte = parseDate(scope, attrs.min, $injector);
                                                    var limit = moment(scope.dateGte);
                                                    return  (date.diff(limit, 'days', true) >= 0);
                                                }
                                                else
                                                {
                                                    throw 'Não foi informada uma data de início para validação "maior ou igual a - (dateGte)".';
                                                }
                                            },
                                            error: function(value, scope, element, attrs){
                                                var message = (attrs.validatorMessage) ? attrs.validatorMessage : 'Informe uma data maior ou igual a ' + moment(scope.dateGte).format('DD/MM/YYYY'); 
                                                showError(element, attrs, message);
                                            },
                                            success: function(value, scope, element, attrs) {
                                                removeError(element, attrs);
                                            }
                                        });
                                        
                                        
                                        
                                        /*
                                         * DateGt
                                         * Deve-se informar o valor limite com o atributo init-date
                                         */
                                        $validatorProvider.register('dateGt', {
                                            invoke: 'blur',
                                            validator: function(value, scope, element, attrs, $injector) {
                                                
                                                if(attrs.min) {
                                                    var date = moment(value);
                                                    scope.dateGt = parseDate(scope, attrs.min, $injector);
                                                    var limit = moment(scope.dateGt);
                                                    return  (date.diff(limit, 'days', true) > 0);
                                                }
                                                else
                                                {
                                                    throw 'Não foi informada uma data de início para validação "maior que - (dateGte)".';
                                                }
                                            },
                                            error: function(value, scope, element, attrs){
                                                var message = (attrs.validatorMessage) ? attrs.validatorMessage : 'Informe uma data maior que ' + moment(scope.dateGt).format('DD/MM/YYYY'); 
                                                showError(element, attrs, message);
                                            },
                                            success: function(value, scope, element, attrs) {
                                                removeError(element, attrs);
                                            }
                                        });
                                        
                                        
                                        
                                        /*
                                         * DateLt
                                         * Deve-se informar o valor limite com o atributo init-date
                                         */
                                        $validatorProvider.register('dateLt', {
                                            invoke: 'blur',
                                            validator: function(value, scope, element, attrs, $injector) {
                                                
                                                if(attrs.max) {
                                                    var date = moment(value);
                                                    scope.dateLt = parseDate(scope, attrs.max, $injector);
                                                    var limit = moment(scope.dateLt);
                                                    return  (date.diff(limit, 'days', true) < 0);
                                                }
                                                else
                                                {
                                                    throw 'Não foi informada uma data inicial para validação "menor que - (dateLt)".';
                                                }
                                            },
                                            error: function(value, scope, element, attrs){
                                                var message = (attrs.validatorMessage) ? attrs.validatorMessage : 'Informe uma data menor que ' + moment(scope.dateLt).format('DD/MM/YYYY'); 
                                                showError(element, attrs, message);
                                            },
                                            success: function(value, scope, element, attrs) {
                                                removeError(element, attrs);
                                            }
                                        });
                                        
                                        /*
                                         * DateBtw (Between)
                                         * Deve-se informar o valor inicial com o atributo min(padrão do datepicker) e o final com o atributo max(padrão datepicker)
                                         */
                                        $validatorProvider.register('dateBtw', {
                                            invoke: 'watch',
                                            validator: function(value, scope, element, attrs, $injector) {
                                                
                                                var date = moment(value);
                                                
                                                if(attrs.min) {
                                                    scope.dateBtwGte = parseDate(scope, attrs.min, $injector);
                                                    var gte = moment(scope.dateBtwGte);
                                                }
                                                else
                                                {
                                                    throw 'Não foi informada uma data inicial para validação "entre X e Y - (dateBtw)".';
                                                }
                                                
                                                if(attrs.max) {
                                                    scope.dateBtwLte = parseDate(scope, attrs.max, $injector);
                                                    var lte = moment(scope.dateBtwLte);
                                                }
                                                else
                                                {
                                                    throw 'Não foi informada uma data fim para validação "entre X e Y - (dateBtw)".';
                                                }
                                                //console.log(date, lte);
                                                return  ((date.valueOf() <= lte.valueOf()) && (date.valueOf() >= gte.valueOf()));
                                                
                                            },
                                            error: function(value, scope, element, attrs){
                                                var message = (attrs.validatorMessage) ? attrs.validatorMessage : 'Informe uma data maior ou igual a ' + moment(scope.dateBtwGte).format('DD/MM/YYYY') + ' e menor ou igual que ' + moment(scope.dateBtwLte).format('DD/MM/YYYY'); 
                                                showError(element, attrs, message);
                                            },
                                            success: function(value, scope, element, attrs) {
                                                removeError(element, attrs);
                                            }
                                        });
                                        
                                }]);
                            
                                return msValidator;
                                
			}
			catch(e) {
				$log.error(e);
			}
			
});
   