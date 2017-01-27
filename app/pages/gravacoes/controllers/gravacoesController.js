define(['msAppJs',
        'componentes/ms-modal/services/msModalService'], function(app) {
	'use strict';

	app.controller('gravacoesController', ['$scope',
	                                             '$msNotifyService',
	                                             'msModalService',
	                                             '$timeout',
	                                             '$translatePartialLoader',
	                                             '$filter',
	                                             '$state',
	                                             '$stateParams',
	                                             'gravacoesService',
	                                             '$rootScope',
	                                             function($scope,
	                                            		 $msNotifyService,
	                                            		 msModalService,
	                                            		 $timeout,
	                                            		 $translatePartialLoader,
	                                            		 $filter,
	                                            		 $state,
	                                            		 $stateParams,
                                                          gravacoesService,
														 $rootScope
	                                            		 ){
		$translatePartialLoader.addPart('gravacoes');

		/**
		 * Controla o nivel de acesso do usuario logado para a funcionalidade em questão
		 */
/*		$timeout(function(){
			apoioService.recuperarPermissoesAcesso("MENSAGENS")
			.then(function(data) {
				$scope.permissaoAcesso = data.resultado;
			});
		}, 100);*/

        $scope.tipo=0;

		 var Gravacao = function () {
			 return {
				 id: null,
				 duracao: 10,
				 data: null,
				 carregado:false,
				 raw: null,
				 thumb: null,
                 cameraFrente:true
			 }
		 };

		var Topico = function () {
			return {
				data:null,
				qtd:0,
				gravacoes:[]
			}
        };

		$scope.carregando=false;
        $scope.scrolling={scroll:false};
		$scope.topico=new Topico();
		$scope.carregados={
			gravacoes:0
		};

		/**
		 * Recuperando o estado da tela de consulta
		 */
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams, error) {
            if(toState!=null && toState.name=="videos"){
                $scope.tipo=3;
            }
            recuperarTopicos();
        });
		/**
			*Salva o estado da tela de consulta para que seja possivel recupera-la quando o usuario voltar
		  */
		 $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams, error) {
			 if(fromState.controller == 'gravacoesController'){
				 // faturaService.salvarViewConsulta($scope.consulta);
			 };
		 });

		 var recuperarTopicos=function () {
             var usuario=$rootScope.usuarioAutenticado;
             if(usuario!=null && usuario.perfil!=null) {
                 gravacoesService.recuperarTopicos(usuario.perfil.id,$scope.tipo).then(function (resp) {
					 $scope.topicos=resp.resultado;
					 $scope.topicos.map(function (item) {
						item.gravacoes=[];
						return item;
                     });
                 });
             }
         };


		 var recuperarGravacaos=function (elemento) {

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
                 gravacoesService.recuperarGravacaos($scope.topico.data,usuario.perfil.id,$scope.tipo, $scope.carregados.gravacoes).then(function (resposta) {

                     angular.forEach(resposta.resultado,function (a) {
                         a=fixGravacao(a);
                     });

                     $scope.topico.gravacoes = $scope.topico.gravacoes.concat(resposta.resultado);
                     $scope.carregados.gravacoes = $scope.topico.gravacoes.length;
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
		     console.info("antes: "+topico.gravacoes.length)
		     $scope.topico=topico;
		     console.info("depois: "+$scope.topico.gravacoes.length)
		     $scope.topico.gravacoes=[];
		     $scope.carregados.gravacoes=0;
		     console.info("chamei no topico")
		     recuperarGravacaos();
		 }

		 var fixGravacao=function (a) {
             a.data=a.data!=null ? a.data.stringToDatetime():null;
             a.carregado=a.carregado=="true";
             return a;
         }

		 $scope.apagarGravacao=function (audio) {
			 gravacoesService.apagar(audio.id).then(function (resp) {
				if(resp){
					$scope.topico.gravacoes=_.reject($scope.topico.gravacoes,function (item) {
						return item.id==audio.id;
                    });
				}
             });
         };

		$scope.scrollEnd=function (elemento) {
            recuperarGravacaos();
        };

		$scope.scrollMessagesEnd=function (elemento) {
		    if($scope.scrolling.scroll) {
		        console.info("chamei no scroll end")
                recuperarGravacaos(elemento);
            }
	 	};

		$scope.abreModal=function () {
            msModalService.setConfig({
                backdrop: true,
                keyboard: false,
                modalFade: true,
//				windowClass : 'modalWidth800',
                template : null,
                templateUrl: './app/pages/gravacoes/directives/templates/novaGravacao.html',
                controller : ['$scope',
					'$rootScope',
                    '$modalInstance',
                    'topico',
                    'tipo',
                    '$msNotifyService',
					'gravacoesService',
                    function(
                        $scope,
						$rootScope,
                        $modalInstance,
                        topico,
                        tipo,
                        $msNotifyService,
						gravacoesService){

                        $scope.topico = topico;
                        $scope.tipo=tipo;
                        $scope.gravacao=new Gravacao();

                        $scope.solicitarGravacao=function () {

                            var usuario=$rootScope.usuarioAutenticado;
                            if(usuario!=null && usuario.perfil!=null && !geral.isEmpty($scope.gravacao.duracao)) {
                                gravacoesService.solicitarGravacao(usuario.perfil.id,$scope.gravacao.duracao,$scope.tipo,$scope.cameraFrente).then(function (resp) {
                                    if(resp.resultado!=null){
                                        var gravacao=fixGravacao(resp.resultado);
                                        gravacao.carregando=true;
                                        gravacao.carregado=false;
                                        gravacao.countdown=gravacao.duracao*1.8;
                                        gravacao.timer=function () {
                                            if(gravacao.countdown>0) {
                                                $timeout(function () {
                                                    gravacao.countdown--;
                                                    gravacao.timer();
                                                }, 1000);
                                            }
                                        };
                                        gravacao.timer();
                                        if($scope.topico.gravacoes.length==0){
                                            $scope.topico.data=gravacao.data.format("DD/MM/YYYY");
                                            $scope.topico.qtd=1;
                                        }
                                        $scope.topico.gravacoes.push(gravacao);
                                        $modalInstance.close($scope.topico);
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
                    topico: function () {
                        return $scope.topico;
                    },
                    tipo: function(){return $scope.tipo}
                }
            }).open();

            msModalService.modalInstance.result.then(function (resultado) {
                $scope.topicos.push(resultado);
            });
		};




	}]);

	return app;
});