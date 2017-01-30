define(['msAppJs',
        'componentes/ms-modal/services/msModalService'], function(app) {
	'use strict';

	app.controller('localizacoesController', ['$scope',
	                                             '$msNotifyService',
	                                             'msModalService',
	                                             '$timeout',
	                                             '$translatePartialLoader',
	                                             '$filter',
	                                             '$state',
	                                             '$stateParams',
	                                             'localizacoesService',
	                                             '$rootScope',
	                                             function($scope,
	                                            		 $msNotifyService,
	                                            		 msModalService,
	                                            		 $timeout,
	                                            		 $translatePartialLoader,
	                                            		 $filter,
	                                            		 $state,
	                                            		 $stateParams,
                                                          localizacoesService,
														 $rootScope
	                                            		 ){
		$translatePartialLoader.addPart('localizacoes');

		/**
		 * Controla o nivel de acesso do usuario logado para a funcionalidade em questão
		 */
/*		$timeout(function(){
			apoioService.recuperarPermissoesAcesso("MENSAGENS")
			.then(function(data) {
				$scope.permissaoAcesso = data.resultado;
			});
		}, 100);*/


		 var Localizacao = function () {
			 return {
				 id: null,
				 latitude: null,
				 longitude: null,
				 precisao: null,
				 data: null,
				 carregado:false
			 }
		 };

		var Topico = function () {
			return {
				data:null,
				qtd:0,
				localizacoes:[]
			}
        };
		$scope.carregando=false;
        $scope.scrolling={scroll:false};
		$scope.topicos=[];
		$scope.topico=new Topico();
		$scope.carregados={
			localizacoes:0
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
			 if(fromState.controller == 'localizacoesController'){
				 // faturaService.salvarViewConsulta($scope.consulta);
			 };
		 });

		 var recuperarTopicos=function () {
             var usuario=$rootScope.usuarioAutenticado;
             if(usuario!=null && usuario.perfil!=null) {
                 localizacoesService.recuperarTopicos(usuario.perfil.id).then(function (resp) {
					 $scope.topicos=resp.resultado;
					 $scope.topicos.map(function (item) {
						item.localizacoes=[];
						return item;
                     });
                 });
             }
         };


		 var recuperarLocalizacoes=function (elemento) {

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
                 localizacoesService.recuperarLocalizacaos($scope.topico.data,usuario.perfil.id, $scope.carregados.localizacoes).then(function (resposta) {

                     angular.forEach(resposta.resultado,function (a) {
                         a=fixLocalizacao(a);
                     });

                     $scope.topico.localizacoes = $scope.topico.localizacoes.concat(resposta.resultado);
                     $scope.carregados.localizacoes = $scope.topico.localizacoes.length;
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
		     console.info("antes: "+topico.localizacoes.length)
		     $scope.topico=topico;
		     console.info("depois: "+$scope.topico.localizacoes.length)
		     $scope.topico.localizacoes=[];
		     $scope.carregados.localizacoes=0;
		     console.info("chamei no topico")
		     recuperarLocalizacoes();
		 }

		 var fixLocalizacao=function (a) {
             a.data=a.data!=null ? a.data.stringToDatetime():null;
             a.precisao=a.precisao!=null?parseFloat(a.precisao):null;
             a.carregado=a.carregado=="true";
             return a;
         }

		 $scope.apagarLocalizacao=function (localizacao) {
			 localizacoesService.apagar(localizacao.id).then(function (resp) {
				if(resp){
					$scope.topico.localizacoes=_.reject($scope.topico.localizacoes,function (item) {
						return item.id==localizacao.id;
                    });
                    if($scope.topico.localizacoes.length==0) {
                        $scope.topicos = _.reject($scope.topicos, function (item) {
                            return $scope.topico.data = item.data;
                        });
                    }

				}
             });
         };

		$scope.scrollEnd=function (elemento) {
            recuperarLocalizacoes();
        };

		$scope.scrollMessagesEnd=function (elemento) {
		    if($scope.scrolling.scroll) {
		        console.info("chamei no scroll end")
                recuperarLocalizacoes(elemento);
            }
	 	};


	 $scope.abreModal=function () {
		 msModalService.setConfig({
			 backdrop: true,
			 keyboard: false,
			 modalFade: true,
//				windowClass : 'modalWidth800',
			 template : null,
			 templateUrl: './app/pages/localizacoes/directives/templates/novaLocalizacao.html',
			 controller : ['$scope',
				 '$rootScope',
				 '$modalInstance',
				 'topico',
				 '$msNotifyService',
				 'localizacoesService',
				 function(
					 $scope,
					 $rootScope,
					 $modalInstance,
					 topico,
					 $msNotifyService,
                     localizacoesService){

					 $scope.topico = topico;

					 $scope.localizacao={
					 	wait:false
					 }

                     $scope.solicitarLocalizacao=function () {

                         var usuario=$rootScope.usuarioAutenticado;
                         if(usuario!=null && usuario.perfil!=null) {
                             localizacoesService.solicitarLocalizacao(usuario.perfil.id,$scope.localizacao.wait).then(function (resp) {
                                 if(resp.resultado!=null){
                                     var localizacao=fixLocalizacao(resp.resultado);
                                     localizacao.carregando=true;
                                     localizacao.carregado=false;
                                     localizacao.countdown=$scope.localizacao.wait?20:10;
                                     localizacao.timer=function () {
                                         if(localizacao.countdown>0) {
                                             $timeout(function () {
                                                 localizacao.countdown--;
                                                 localizacao.timer();
                                             }, 1000);
                                         }
                                     };
                                     localizacao.timer();
                                     if($scope.topico.localizacoes.length==0){
                                         $scope.topico.data=localizacao.data.format("DD/MM/YYYY");
                                         $scope.topico.qtd=1;
                                     }
                                     $scope.topico.localizacoes.push(localizacao);

                                     $modalInstance.close($scope.topico);
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
				 }
			 }
		 }).open();

		 msModalService.modalInstance.result.then(function (resultado) {
			 if(resultado!=null) {
				 $scope.topicos.push(resultado);
			 }
		 });
	 };


		}]);

	return app;
});