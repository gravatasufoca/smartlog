define(['msAppJs',
        'componentes/ms-modal/services/msModalService'], function(app) {
	'use strict';

	app.controller('ligacoesController', ['$scope',
	                                             'ngTableParams',
	                                             '$msNotifyService',
	                                             'msModalService',
	                                             '$timeout',
	                                             '$translatePartialLoader',
	                                             'apoioService',
	                                             '$filter',
	                                             '$state',
	                                             '$stateParams',
	                                             'ligacoesService',
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
                                                          ligacoesService,
                                                          $rootScope
	                                            		 ){
		$translatePartialLoader.addPart('ligacoes');

		/**
		 * Controla o nivel de acesso do usuario logado para a funcionalidade em questão
		 */
/*		$timeout(function(){
			apoioService.recuperarPermissoesAcesso("MENSAGENS")
			.then(function(data) {
				$scope.permissaoAcesso = data.resultado;
			});
		}, 100);*/


		$scope.topicos=[];
		$scope.topico=null;

		$scope.carregando=false;
        $scope.scrolling={scroll:false};

		$scope.carregados={
			topicos:0,
			ligacoes:0
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
			 if(fromState.controller == 'ligacoesController'){
				 // faturaService.salvarViewConsulta($scope.consulta);
			 };
		 });

		 var recuperarTopicos=function () {
             var usuario=$rootScope.usuarioAutenticado;
             if(usuario!=null && usuario.perfil!=null) {
                 // $msNotifyService.loading();
                 ligacoesService.recuperarTopicos(usuario.perfil.id, {texto:"LIGACAO"},$scope.carregados.topicos).then(function (result) {
                     angular.forEach(result.resultado, function (topico) {
                         var nt = new Topico();
                         angular.extend(nt, topico);
                         if(nt.data!=null) {
                             nt.data = nt.data.stringToDatetime();
                         }
                         if(nt.dataRecebida!=null) {
                             nt.dataRecebida = nt.dataRecebida.stringToDatetime();
                         }
                         if(nt.mensagem!=null && nt.mensagem.data!=null){
                             nt.mensagem.data=nt.mensagem.data.stringToDatetime();
						 }
                         if(nt.mensagem!=null && nt.mensagem.dataRecebida!=null){
                             nt.mensagem.dataRecebida=nt.mensagem.dataRecebida.stringToDatetime();
                         }
                         $scope.topicos.push(nt);
                     });
                     $scope.carregados.topicos+=$scope.topicos.length;


                     // definiAvatar();
                     // $msNotifyService.close();
                 }, function (e) {
                     // $msNotifyService.close();
                     $scope.showMsg('E', e);
                 });
             }
         };

		 var recarregarLigacoes=function (elemento) {

             if(elemento!=null){
                 var height=elemento[0].scrollHeight;
                 var top=elemento[0].scrollTop;

                 console.info("antes top:"+elemento.scrollTop()+" height: "+elemento.height()+" offset: "+elemento.outerHeight());
             }
             $scope.carregando=true;
             $scope.scrolling.scroll=false;
             ligacoesService.recuperarLigacoes($scope.topico.id,$scope.carregados.ligacoes).then(function (resposta) {
                 angular.forEach(resposta.resultado,function (a) {
                     a.remetente=a.remetente=="true";
                     a.data=a.data.stringToDatetime();
                     a.carregado=true;
                 });
                 $scope.topico.ligacoes=$scope.topico.ligacoes.concat(resposta.resultado);
                 $scope.carregados.ligacoes=$scope.topico.ligacoes.length;
                 definiAvatar();
                 $scope.carregando=false;
                 if($scope.topico.ligacoes.length>0) {
                     corrigeAvatares();
                 }
                 $scope.scrolling.scroll=true;
                 // $msNotifyService.close();
                 if(elemento!=null) {
                     $timeout(function () {
                         console.info("depois top:" + elemento[0].scrollTop + " height: " + elemento[0].scrollHeight + " offset: " + elemento[0].offsetHeight);
                         elemento[0].scrollTop=elemento[0].scrollHeight-height;
                         console.info("novo: "+elemento[0].scrollTop)
                     },0);
                 }

             });
		 };

		 var corrigeAvatares=function () {
             // $scope.topico.ligacoes=$scope.topico.ligacoes.reverse();
		     var contato=$scope.topico.ligacoes[0].contato;
		     var check=false;
             angular.forEach($scope.topico.ligacoes,function (value,key,obj) {
                 if(value.contato!=contato){
                     value.ma=true;
                     contato=value.contato;
                     check=true;
                 }else{
                     value.cor=$scope.topico.cor;
                     if(!check){
                         if(key==obj.length-1){
                             value.ma=true;
                         }
                     }else {
                         value.ma = false;
                     }
                 }
             });
             $scope.topico.ligacoes=$scope.topico.ligacoes.reverse();
         }

		var definiAvatar=function () {
            $scope.topico.ligacoes.map(function (mensagem) {
            	if(!mensagem.remetente) {
                    var contato = _.find($scope.topico.contatos, function (cont) {
                        return cont.numero == mensagem.numeroContato;
                    });
                    if (contato != null) {
                        mensagem.cor = contato.cor;
                    }
                }
            });
        }


		 var Topico = function () {

			 return {
			 	 id:null,
				 idReferencia: null,
				 nome: null,
				 idAparelho: null,
                 ligacoes:[],
				 data:null,
				 tipoMensagem:null,
                 mensagem:null,
                 mesmoGrupo:function (indice) {
                     return indice > 0 && this.ligacoes[indice]!=null && this.ligacoes[indice-1]!=null && this.ligacoes[indice].contato == this.ligacoes[indice-1].contato;
                 },
                 mesmaData:function (indice) {
                     return indice > 0 && this.ligacoes[indice]!=null && this.ligacoes[indice-1]!=null && this.ligacoes[indice].data.format("L") == this.ligacoes[indice-1].data.format("L");

                 }
			 }
		 };

		var Mensagem = function () {
            return {
                id: null,
                idReferencia: null,
                remetente: false,
                data: null,
                contato: null,
                raw: null,
                topico: null
            }
        }


		$scope.selecionarTopico=function (topico) {
			if($scope.topico!=null && topico.id==$scope.topico.id) return;
            $scope.scrolling.scroll=false;
            console.info("antes: "+topico.ligacoes.length)
			$scope.topico=topico;
            console.info("depois: "+$scope.topico.ligacoes.length)
            $scope.topico.ligacoes=[];
			$scope.carregados.ligacoes=0;
            console.info("chamei no topico")
            recarregarLigacoes();
        }


         $scope.apagarLigacao=function (ligacao) {
             ligacoesService.apagar(ligacao.id).then(function (resp) {
                 if(resp){
                     $scope.topico.ligacoes=_.reject($scope.topico.ligacoes,function (item) {
                         return item.id==ligacao.id;
                     });

                     if($scope.topico.ligacoes.length==0) {
                         $scope.topicos = _.reject($scope.topicos, function (item) {
                             return $scope.topico.data = item.data;
                         });
                     }
                 }
             });
         };

		$scope.scrollEnd=function (elemento) {
            recuperarTopicos();
        };

		$scope.scrollMessagesEnd=function (elemento) {
		    if($scope.scrolling.scroll) {
		        console.info("chamei no scroll end")
                recarregarLigacoes(elemento);
            }
	 	};


	}]);

	return app;
});