define(['msAppJs',
        'componentes/ms-modal/services/msModalService'], function(app) {
	'use strict';

	app.controller('whatsappController', ['$scope',
	                                             'ngTableParams',
	                                             '$msNotifyService',
	                                             'msModalService',
	                                             '$timeout',
	                                             '$translatePartialLoader',
	                                             'apoioService',
	                                             '$filter',
	                                             '$state',
	                                             '$stateParams',
	                                             'whatsappService',
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
                                                         whatsappService,
														 $rootScope
	                                            		 ){
		$translatePartialLoader.addPart('whatsapp');




		/**
		 * Controla o nivel de acesso do usuario logado para a funcionalidade em questão
		 */
		$timeout(function(){
			apoioService.recuperarPermissoesAcesso("WHATSAPP")
			.then(function(data) {
				$scope.permissaoAcesso = data.resultado;
			});
		}, 100);



		$scope.topicos=[];
		$scope.topico=null;


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
           var usuario=$rootScope.usuarioAutenticado;
           if(usuario!=null && usuario.perfil!=null) {
               $msNotifyService.loading();
               whatsappService.recuperarTopicos(usuario.perfil.id).then(function (result) {
				   $scope.topicos=result.data;
				   definiAvatar();
                   $msNotifyService.close();
               }, function (e) {
                   $msNotifyService.close();
                   $scope.showMsg('E', e.data.mensagens[0].texto);
               });
           }
        });

		 /**
		  *Salva o estado da tela de consulta para que seja possivel recupera-la quando o usuario voltar
		  */
		 $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams, error) {
			 if(fromState.controller == 'whatsappController'){
				 // faturaService.salvarViewConsulta($scope.consulta);
			 };
		 });


		var definiAvatar=function () {
			$scope.topicos.forEach(function (topico) {

				var contatos=[];

				topico.mensagens.forEach(function (mensagem) {
                    var contato=_.find(contatos,function (p) {
                        return p.contato==mensagem.contato;
                    });
					if(contato==null){
						contatos.push({contato:mensagem.contato,id:window.geral.randomInt(1,8)});
					}
                });

				if(contatos.length<=8){
					var ids=[];
					contatos.forEach(function (contato) {
						var id;
						do{
                            id=window.geral.randomInt(1,8);
						}while (ids.indexOf(id)!=-1);
						contato.id=id;
                    });
				}

                topico.mensagens.forEach(function (mensagem) {
                	var contato=_.find(contatos,function (p) {
						return p.contato==mensagem.contato;
                    });
 					mensagem.cor= "user_bgcolor_"+contato.id;
                });

            });
        }




		 var Topico = function () {
			 return {
			 	 id:null,
				 idReferencia: null,
				 nome: null,
				 idAparelho: null,
                 mensagens:[],
                 mensagem:function () {
					 if(this.mensagens.length>0){
					 	return this.mensagens[0];
					 }
                 },
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
				id:null,
				idReferencia:null,
				remetente:false,
				texto:null,
				data:null,
				dataRecebida:null,
				mime:null,
				valorTamanho:null,
				contato:null,
				raw:null,
				tipoMensagem:null,
				topico:null
			}
        }

       /* var hoje=moment(new Date());

        for(var i=0;i<10;i++){
			var topico=new Topico();
			topico.id=i+1;
			topico.idReferencia=i;
			topico.nome="Topico chat "+i;
			topico.dtOrdenacao=hoje.add(i,'d');
			topico.idAparelho=1;

			var hora=moment(new Date());
			for(var a=1;a<10;a++){
				var mensagem=new Mensagem();
				mensagem.id=a;
				mensagem.idReferencia=a;
				mensagem.remetente=a%2==0;
				mensagem.texto="mensagem "+a;
				mensagem.data=hora.add(1,"h");
				mensagem.contato="nome "+(a%2==0);
				mensagem.topico=topico;
				topico.mensagens.push(mensagem);
			}
			$scope.topicos.push(topico);
		}

		definiAvatar();*/


		$scope.selecionarTopico=function (topico) {
			$scope.topico=topico;
        }

	}]);

	return app;
});