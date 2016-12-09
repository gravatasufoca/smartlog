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
		$timeout(function(){
			apoioService.recuperarPermissoesAcesso("MENSAGENS")
			.then(function(data) {
				$scope.permissaoAcesso = data.resultado;
			});
		}, 100);



		$scope.topicos=[];
		$scope.topico=null;

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
            recuperarMensagens();
        });
		/**
			*Salva o estado da tela de consulta para que seja possivel recupera-la quando o usuario voltar
		  */
		 $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams, error) {
			 if(fromState.controller == 'mensagensController'){
				 // faturaService.salvarViewConsulta($scope.consulta);
			 };
		 });

		 var recuperarMensagens=function () {
             var usuario=$rootScope.usuarioAutenticado;
             if(usuario!=null && usuario.perfil!=null) {
                 $msNotifyService.loading();
                 $scope.topicos=[];
                 mensagensService.recuperarTopicos(usuario.perfil.id, getTab()).then(function (result) {
                     angular.forEach(result.resultado, function (topico) {
                         var nt = new Topico();
                         angular.extend(nt, topico);
                         $scope.topicos.push(nt);
                     });

                     // definiAvatar();
                     $msNotifyService.close();
                 }, function (e) {
                     $msNotifyService.close();
                     $scope.showMsg('E', e);
                 });
             }
         };

		var definiAvatar=function () {
            $scope.topico.mensagens.map(function (mensagem) {
				var contato=_.find($scope.topico.contatos,function (cont) {
					return cont.numero==mensagem.numeroContato;
                });

				if(contato!=null){
					mensagem.cor=contato.cor;
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
					 if(indice>0){
						if(this.mensagens[indice-1].contato==this.mensagens[indice].contato){
							return true;
						}
					 }
					 return false;
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
            $msNotifyService.loading();
            mensagensService.recuperarMensagens(topico.id).then(function (resposta) {

				topico.mensagens=resposta.resultado;
				$scope.topico=topico;
				definiAvatar();
                $msNotifyService.close();

            });
        }

        $scope.selecionarTab=function (tab) {
			$scope.tabs.map(function (t) {
				t.ativo=false;
				return t;
            });
			tab.ativo=true;

			recuperarMensagens();
        };

		var getTab=function () {
			return _.find($scope.tabs,function (tab) {
				return tab.ativo;
            })
        };

	}]);

	return app;
});