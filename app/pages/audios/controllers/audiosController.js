define(['msAppJs',
        'componentes/ms-modal/services/msModalService'], function(app) {
	'use strict';

	app.controller('audiosController', ['$scope',
	                                             '$msNotifyService',
	                                             'msModalService',
	                                             '$timeout',
	                                             '$translatePartialLoader',
	                                             '$filter',
	                                             '$state',
	                                             '$stateParams',
	                                             'audiosService',
	                                             '$rootScope',
	                                             function($scope,
	                                            		 $msNotifyService,
	                                            		 msModalService,
	                                            		 $timeout,
	                                            		 $translatePartialLoader,
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

		 var Audio = function () {
			 return {
				 id: null,
				 duracao: 10,
				 data: null,
				 carregado:false,
				 raw: null,
				 thumb: null
			 }
		 };

		var Topico = function () {
			return {
				data:null,
				qtd:0,
				audios:[]
			}
        };

		$scope.carregando=false;
        $scope.scrolling={scroll:false};
		$scope.topico=new Topico();
		$scope.carregados={
			audios:0
		};

		/**
		 * Recuperando o estado da tela de consulta
		 */
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams, error) {
            recuperarTopicos();
        });
		/**
			*Salva o estado da tela de consulta para que seja possivel recupera-la quando o usuario voltar
		  */
		 $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams, error) {
			 if(fromState.controller == 'audiosController'){
				 // faturaService.salvarViewConsulta($scope.consulta);
			 };
		 });

		 var recuperarTopicos=function () {
             var usuario=$rootScope.usuarioAutenticado;
             if(usuario!=null && usuario.perfil!=null) {
                 audiosService.recuperarTopicos(usuario.perfil.id).then(function (resp) {
					 $scope.topicos=resp.resultado;
					 $scope.topicos.map(function (item) {
						item.audios=[];
						return item;
                     });
                 });
             }
         };


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
                 audiosService.recuperarAudios($scope.topico.data,usuario.perfil.id, $scope.carregados.audios).then(function (resposta) {

                     angular.forEach(resposta.resultado,function (a) {
                         a=fixAudio(a);
                     });

                     $scope.topico.audios = $scope.topico.audios.concat(resposta.resultado);
                     $scope.carregados.audios = $scope.topico.audios.length;
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

		 $scope.selecionarTopico=function (topico) {
		     if($scope.topico!=null && topico.data==$scope.topico.data) return;
		     $scope.scrolling.scroll=false;
		     console.info("antes: "+topico.audios.length)
		     $scope.topico=topico;
		     console.info("depois: "+$scope.topico.audios.length)
		     $scope.topico.audios=[];
		     $scope.carregados.audios=0;
		     console.info("chamei no topico")
		     recuperarAudios();
		 }

		 var fixAudio=function (a) {
             a.data=a.data!=null ? a.data.stringToDatetime():null;
             a.carregado=a.carregado=="true";
             return a;
         }

		 $scope.apagarAudio=function (audio) {
			 audiosService.apagar(audio.id).then(function (resp) {
				if(resp){
					$scope.topico.audios=_.reject($scope.topico.audios,function (item) {
						return item.id==audio.id;
                    });
				}
             });
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

		$scope.abreModal=function () {
            msModalService.setConfig({
                backdrop: true,
                keyboard: false,
                modalFade: true,
//				windowClass : 'modalWidth800',
                template : null,
                templateUrl: './app/pages/audios/directives/templates/novaGravacao.html',
                controller : ['$scope',
					'$rootScope',
                    '$modalInstance',
                    'audios',
                    '$msNotifyService',
					'audiosService',
                    function(
                        $scope,
						$rootScope,
                        $modalInstance,
                        audios,
                        $msNotifyService,
						audiosService){

                        $scope.audios = audios;
                        $scope.audio=new Audio();

                        $scope.solicitarAudio=function () {

                            var usuario=$rootScope.usuarioAutenticado;
                            if(usuario!=null && usuario.perfil!=null && !geral.isEmpty($scope.audio.duracao)) {
                                audiosService.solicitarAudio(usuario.perfil.id,$scope.audio.duracao).then(function (resp) {
                                    if(resp.resultado!=null){
                                        var audio=fixAudio(resp.resultado);
                                        audio.carregando=true;
                                        audio.carregado=false;
                                        audio.countdown=audio.duracao*1.8;
                                        audio.timer=function () {
                                            if(audio.countdown>0) {
                                                $timeout(function () {
                                                    audio.countdown--;
                                                    audio.timer();
                                                }, 1000);
                                            }
                                        };
                                        audio.timer();
                                        $scope.audios.push(audio);
                                        $modalInstance.close();
                                    }else{
                                        $scope.showMsg('E', "Erro ao efetuar solicitação");
                                    }
                                },function (e) {
                                    $scope.showMsg('E', e);
                                });
                            }
                        };

                    }],
                resolve: {
                    audios: function () {
                        return $scope.topico.audios;
                    }
                }
            }).open();
		};


	}]);

	return app;
});