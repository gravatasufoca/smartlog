define(['msAppJs',
        'componentes/ms-modal/services/msModalService'], function(app) {
	'use strict';

	app.controller('audiosController', ['$scope',
	                                             'ngTableParams',
	                                             '$msNotifyService',
	                                             'msModalService',
	                                             '$timeout',
	                                             '$translatePartialLoader',
	                                             'apoioService',
	                                             '$filter',
	                                             '$state',
	                                             '$stateParams',
	                                             'audiosService',
	                                             '$rootScope',
	                                             function($scope,
	                                            		 ngTableParams,
	                                            		 $msNotifyService,
	                                            		 msModalService,
	                                            		 $timeout,
	                                            		 $translatePartialLoader,
	                                            		 apoioService,
	                                            		 $filter,
	                                            		 $state,
	                                            		 $stateParams,
                                                          audiosService,
														 $rootScope
	                                            		 ){
		$translatePartialLoader.addPart('audios');




		/**
		 * Controla o nivel de acesso do usuario logado para a funcionalidade em questão
		 */
/*		$timeout(function(){
			apoioService.recuperarPermissoesAcesso("MENSAGENS")
			.then(function(data) {
				$scope.permissaoAcesso = data.resultado;
			});
		}, 100);*/



		$scope.carregando=false;
        $scope.scrolling={scroll:false};

		$scope.carregados={
			audios:0
		};

		$scope.audios=[];

		/**
		 * Recuperando o estado da tela de consulta
		 */
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams, error) {
            recuperarAudios();
        });
		/**
			*Salva o estado da tela de consulta para que seja possivel recupera-la quando o usuario voltar
		  */
		 $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams, error) {
			 if(fromState.controller == 'audiosController'){
				 // faturaService.salvarViewConsulta($scope.consulta);
			 };
		 });


		 var recuperarAudios=function (elemento) {

             if(elemento!=null){
                 var height=elemento[0].scrollHeight;
                 var top=elemento[0].scrollTop;
                 var offSet=elemento[0].offsetHeight;

                 console.info("antes top:"+elemento.scrollTop()+" height: "+elemento.height()+" offset: "+elemento.outerHeight());
             }

             var usuario=$rootScope.usuarioAutenticado;
             if(usuario!=null && usuario.perfil!=null) {

                 $scope.carregando = true;
                 $scope.scrolling.scroll = false;
                 audiosService.recuperarAudios(usuario.perfil.id, $scope.carregados.audios).then(function (resposta) {

                     angular.forEach(resposta.resultado,function (a) {
                         a.data=a.data.stringToDatetime();
                         a.carregado=a.carregado=="true";
                     });

                     $scope.audios = $scope.audios.concat(resposta.resultado);
                     $scope.carregados.audios = $scope.audios.length;
                     $scope.carregando = false;

                     $scope.scrolling.scroll = true;
                     // $msNotifyService.close();
                     if (elemento != null) {
                         $timeout(function () {
                             console.info("depois top:" + elemento[0].scrollTop + " height: " + elemento[0].scrollHeight + " offset: " + elemento[0].offsetHeight);
                             elemento[0].scrollTop = elemento[0].scrollHeight - height;
                             console.info("novo: " + elemento[0].scrollTop)
                         }, 0);
                     }

                 });
             }
		 };


		var Audio = function () {
            return {
                id: null,
                duracao: false,
                data: null,
                carregado:false,
                raw: null,
                thumb: null
            }
        };


		$scope.scrollEnd=function (elemento) {
            recuperarAudios();
        };

		$scope.scrollMessagesEnd=function (elemento) {
		    if($scope.scrolling.scroll) {
		        console.info("chamei no scroll end")
                recuperarAudios(elemento);
            }
	 	};


	}]);

	return app;
});