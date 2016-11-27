define([
        'componentes/ms-seguranca/services/msSegurancaService',
        ], 
		function(msSeguranca) {
		
		'use strict';
		
                msSeguranca.directive('msUsuarioInfo', ['msSegurancaService', '$compile', 
                    function(msSegurancaService, $compile) {
		
                    return {
                        restrict: 'E',
                        link: function(scope, element, attrs, ctrl) {
                            try {
                                scope.$watch(attrs.usuarioAutenticado, function(usuario) {
                                    if(typeof usuario != 'undefined'&& typeof usuario.perfil != 'undefined'){

                                        var template = angular.element('\n\
                                                                    <a ng-click="editUsuario()" role="button" class="configuracao">\n\
                                                                        <span class="icone icone-cog"></span>\n\
                                                                        <span class="usuarioLogado">' + usuario.nome + '</span>\n\
                                                                    </a>, \n\
                                                                    <span class="perfilUsuario">' + usuario.perfil + '</span>');

                                        element.html( template );
                                        $compile(element.contents())(scope);
                                    }
                                });
                            }
                            catch(e) {
                                scope.$msNotify.error(e);
                            }
                        }
                    };
	}]);
		
        return msSeguranca;
		
});

