define(['msAppJs'
        ], function(app) {
	app.factory('mensagensService', ['resourceRest',"$http","$q","$timeout",'fileSystemService', function(resourceRest, $http, $q, $timeout,fileSystemService){

		var recuperarTopicos=function (idAparelho,tab,carregados) {
			return resourceRest.topico.one("aparelho",idAparelho).one("tipo",tab.texto.toUpperCase()).one("c",carregados).getList();
        };

		var recuperarMensagens = function (idTopico,carregados) {
			return resourceRest.mensagem.one("topico",idTopico).one("c",carregados).getList();
        };

        var recuperarArquivo = function (idMensagem) {
        	var time=arguments.length>1? arguments[1]:0;
            window.geral.sleep(time*1000);
            console.info(time);
            return resourceRest.mensagem.one("arquivo", idMensagem).one("solicita",time==0).get().then(function (resultado) {
            	console.info(resultado);
            	if(resultado!=null && resultado.success){
            		if(time==60) return null;

            		if(resultado.arquivo==null){
						return recuperarArquivo(idMensagem,time+10);
					}else{
            			return resultado.arquivo;
					}
				}
            });
        };
        
        var carregarArquivo=function (mensagem) {
                mensagem.carregando = true;
                mensagem.carregado = false;
                recuperarArquivo(mensagem.idReferencia).then(function (resultado) {
                    if (resultado != null) {
                        mensagem.carregado = true;
                        carregarMidia(mensagem);
                    } else {
                        mensagem.carregando = false;
                        mensagem.carregado = false;
                    }
                }, function (e) {
                    $timeout(function () {
                        console.error(e);
                        mensagem.carregando = false;
                        mensagem.carregado = false;
                    }, 100);
                });
            

        };

		var carregarMidia=function (mensagem) {

			mensagem.src = "data:" + mensagem.midiaMime + ";base64," + mensagem.thumb;

			if (mensagem.carregado) {
				mensagem.carregando=true;
				fileSystemService.getMensagemUrl(mensagem.idReferencia).then(function (resp) {
					if (resp != null) {
						mensagem.src = resp;
						mensagem.carregando = false;
					}
				}, function () {
					fileSystemService.cacheMensagem(mensagem.idReferencia, mensagem.midiaMime).then(function (resp) {
						if (resp) {
							fileSystemService.getMensagemUrl(mensagem.idReferencia).then(function (resp) {
								if (resp != null) {
									mensagem.src = resp;
									mensagem.carregando = false;
								}
							});
						}
					});
				});

			}
		};
			
        


		return {
            recuperarTopicos:recuperarTopicos,
			recuperarMensagens:recuperarMensagens,
			recuperarArquivo:recuperarArquivo,
			carregarArquivo:carregarArquivo,
			carregarMidia:carregarMidia
		};

	}]);

	return app;
});