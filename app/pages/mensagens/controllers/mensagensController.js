define(['msAppJs',
        'componentes/ms-modal/services/msModalService'], function(app) {
	'use strict';

	app.controller('mensagensController', ['$scope',
	                                             'ngTableParams',
	                                             '$msNotifyService',
	                                             'msModalService',
	                                             '$timeout',
	                                             '$translatePartialLoader',
	                                             'apoioService',
	                                             '$filter',
	                                             '$state',
	                                             '$stateParams',
	                                             'mensagensService',
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
                                                          mensagensService,
														 $rootScope
	                                            		 ){
		$translatePartialLoader.addPart('mensagens');




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

		$scope.carregados={
			topicos:0,
			mensagens:0
		};

		$scope.tabs=[{
			texto:"SMS",
			ativo:true
		},{
            texto:"WhatsApp",
            ativo:false
        },{
            texto:"Messenger",
            ativo:false
        }];

		/**
		 * Recuperando o estado da tela de consulta
		 */
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams, error) {
           /* if ($stateParams.id) {
                topicoService.recuperarTopicos($stateParams.id)
                    .then(function (data) {
                        $scope.agencia = data.resultado;

                        contratoAgencia.recuperarContratoVigentePorAgencia($scope.agencia.id).then(function (d) {
                            $scope.agencia.contrato = d.resultado;
                        });

                        //$scope.agenciaSecundaria = $scope.agencia.agenciaAditivo;
                        if (window.geral.isEmpty($scope.agencia.telefoneAgencia)) {
                            $scope.agencia.telefoneAgencia = new TelefoneAgencia();
                        }

                        console.log($scope)
                    }, function (e) {
                        $timeout(function () {
                            $state.go("agencia");
                            $scope.showMsg('E', e.data.mensagens[0].texto);
                        }, 100);
                    });
            }*/
            recuperarTopicos();
        });
		/**
			*Salva o estado da tela de consulta para que seja possivel recupera-la quando o usuario voltar
		  */
		 $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams, error) {
			 if(fromState.controller == 'mensagensController'){
				 // faturaService.salvarViewConsulta($scope.consulta);
			 };
		 });

		 var recuperarTopicos=function () {
             var usuario=$rootScope.usuarioAutenticado;
             if(usuario!=null && usuario.perfil!=null) {
                 // $msNotifyService.loading();
                 mensagensService.recuperarTopicos(usuario.perfil.id, getTab(),$scope.carregados.topicos).then(function (result) {
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

		 var recarregarMensagens=function (elemento) {
             // $msNotifyService.loading();
             if(elemento!=null){
                 console.info("top:"+elemento.scrollTop()+" height: "+elemento.height()+" offset: "+elemento.outerHeight());
             }
             $scope.carregando=true;
             mensagensService.recuperarMensagens($scope.topico.id,$scope.carregados.mensagens).then(function (resposta) {
                 angular.forEach(resposta.resultado,function (a) {
                     a.remetente=a.remetente=="true";
                     a.data=a.data.stringToDatetime();
                     a.dataRecebida=a.dataRecebida.stringToDatetime()
                 });
                 $scope.topico.mensagens=$scope.topico.mensagens.concat(resposta.resultado);
                 $scope.carregados.mensagens=$scope.topico.mensagens.length;
                 definiAvatar();
                 $scope.carregando=false;
                 if($scope.topico.mensagens.length>0) {
                     corrigeAvatares();
                 }
                 // $msNotifyService.close();

             });
		 };

		 var corrigeAvatares=function () {
             $scope.topico.mensagens=$scope.topico.mensagens.reverse();
		     var contato=$scope.topico.mensagens[0].contato;
             angular.forEach($scope.topico.mensagens,function (a) {
                 if(a.contato!=contato){
                     a.ma=true;
                     contato=a.contato;
                 }else{
                     a.ma=false;
                 }
             });
             $scope.topico.mensagens=$scope.topico.mensagens.reverse();
         }

		var definiAvatar=function () {
            $scope.topico.mensagens.map(function (mensagem) {
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
                 mensagens:[],
				 data:null,
				 tipoMensagem:null,
                 mensagem:null,
                 mesmoGrupo:function (indice) {
                     return indice > 0 && this.mensagens[indice]!=null && this.mensagens[indice-1]!=null && this.mensagens[indice].contato == this.mensagens[indice-1].contato;
                 },
                 mesmaData:function (indice) {
                     return indice > 0 && this.mensagens[indice]!=null && this.mensagens[indice-1]!=null && this.mensagens[indice].data.format("L") == this.mensagens[indice-1].data.format("L");

                 }
			 }
		 };

		var Mensagem = function () {
            return {
                id: null,
                idReferencia: null,
                remetente: false,
                texto: null,
                data: null,
                dataRecebida: null,
                mime: null,
                valorTamanho: null,
                contato: null,
                raw: null,
                tipoMensagem: null,
                topico: null
            }
        }


		$scope.selecionarTopico=function (topico) {
			if($scope.topico!=null && topico.id==$scope.topico.id) return;
			$scope.topico=angular.copy(topico);
			$scope.carregados.mensagens=0;
            recarregarMensagens();
        }


        $scope.selecionarTab=function (tab) {
			$scope.tabs.map(function (t) {
				t.ativo=false;
				return t;
            });
			tab.ativo=true;
            $scope.topico={};
            $scope.topicos=[];
            $scope.carregados={
                topicos:0,
                mensagens:0
            };
			recuperarTopicos();
        };

		var getTab=function () {
			return _.find($scope.tabs,function (tab) {
				return tab.ativo;
            })
        };

		$scope.scrollEnd=function (elemento) {
            recuperarTopicos();
        };

		$scope.scrollMessagesEnd=function (elemento) {
            recarregarMensagens(elemento);
	 	};


	}]);

	return app;
});