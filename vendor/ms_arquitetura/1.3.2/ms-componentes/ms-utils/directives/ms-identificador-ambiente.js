define([
        'componentes/ms-utils/msUtils',
        ], 
        function(msUtils) {
            'use strict';
            
            /*
             * Diretiva de compilação para ng-html-bind, quando 
             */
            msUtils.directive('msIdentificadorAmbiente', function($compile) {

                return {
                        restrict: 'E',
                        scope: true,
                        link: function(scope, element, attrs) {
                            try {
                                scope.$watch(attrs.ambiente, function(content) {
                                    
                                    var configAmbiente = {
                                            dev: {
                                                estilo : 'statusprojeto alert alert-warning ativo',
                                                nome : 'Desenvolvimento',
                                                icone: 'icones-de-desenvolvimento'
                                            },
                                            hmg: {
                                                estilo : 'statusprojeto alert alert-danger ativo',
                                                nome : 'Desenvolvimento',
                                                icone: 'icones-de-homologacao'
                                            },
                                            prototipo: {
                                                estilo : 'statusprojeto alert alert-info ativo',
                                                nome : 'Protótipo',
                                                icone: 'icones-de-prototipo'
                                            }
                                    };
                                    
                                    var template = angular.element('<div class="' + configAmbiente[content.nome].estilo + '" id="desenvolvimento">\n\
                                                                        <h3><span class="' + configAmbiente[content.nome].icone + '"></span>' + configAmbiente[content.nome].nome + '</h3>\n\
                                                                    </div>');
                                    element.html( template );
                                    $compile(element.contents())(scope);
                                });

                            }
                            catch(e) {
                                scope.$msNotify.error(e);
                            }
                        }
                    };
              });
            
            return msUtils;
			
});