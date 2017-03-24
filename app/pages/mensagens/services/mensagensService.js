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

            var getArquivo=function (resp) {
                if(mensagem.tipoMidia!=1) {
                    resp.file(function (file) {
                        $timeout(function () {
                            console.log("mensagem nao eh imagem... olha o blob: "+URL.createObjectURL(file))
                            mensagem.src = URL.createObjectURL(file);
                            mensagem.carregando = false;
                            mensagem.carregado = true;
                        });
                    });
                }else{
                    $timeout(function () {
                        console.log("mensagem eh imagem... olha o link: "+resp.toURL())
                        mensagem.src = resp.toURL();
                        mensagem.carregando = false;
                        mensagem.carregado = true;
                    });
                }
            };

			mensagem.src = "data:" + mensagem.midiaMime + ";base64," + mensagem.thumb;

			if (mensagem.carregado) {
				console.log("tentando pegar do cache")
				mensagem.carregando=true;
				fileSystemService.getMensagemUrl(mensagem.idReferencia).then(function (resp) {
                    console.log("solicitacao feita: "+resp)
					if (resp != null) {
                        getArquivo(resp);
					}
				}, function () {
                    console.log("pedindo mensagem do servidor")
					fileSystemService.cacheMensagem(mensagem.idReferencia, mensagem.midiaMime).then(function (resp) {
						if (resp) {
                            console.log("solicitacao feita, tentando pegar do cache")
							fileSystemService.getMensagemUrl(mensagem.idReferencia).then(function (resp) {
                                console.log("solicitacao feita: "+resp)
                                if (resp != null) {
									getArquivo(resp);
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