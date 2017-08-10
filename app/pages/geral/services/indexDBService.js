define(['msAppJs'], function(app) {
    app.factory('indexDBService', ['$q',
        '$http',
        '$rootScope',
        'resourceRest',
        '$indexedDB',
        function($q,
                 $http,
                 $rootScope,
                 resourceRest,$indexedDB){

            var GRAVACAODB="gravacao";
            var ARQUIVODB="arquivo";



            var cacheMensagem = function(idPerfil,id) {
                var def = $q.defer();

                resourceRest.mensagem.one("arquivo", id).withHttpConfig({responseType: 'blob'}).get().then(function (resp) {
                    console.info("requisicao feita1");
                    if (resp==null && time == 60) {
                        def.reject();
                        return null;
                    }
                    if (resp!=null) {
                        console.info("escrevendo blob");
                        // console.info(fileSystem.writeBlob("arquivos/gravacoes/" + id, resp));

                        $indexedDB.openStore(ARQUIVODB,function (store) {
                            store.insert({"idPerfil":idPerfil,"idArquivo":id,"raw":resp}).then(function (r) {
                                def.resolve(r);
                            },function (err) {
                                console.error(err);
                            });
                        });
                    }
                },function (err) {
                    console.error(err);
                    def.reject();
                });
                return def.promise;
            };

            var cacheArquivo = function(idPerfil,id) {
                var def = $q.defer();
                resourceRest.gravacao.withHttpConfig({responseType: 'blob',fullResponse:true}).get(id).then(function (resp) {
                    console.info("requisicao feita1");
                    if (resp==null && time == 60) {
                        def.reject();
                        return null;
                    }
                    if (resp!=null) {
                        console.info("escrevendo blob");
                        // console.info(fileSystem.writeBlob("arquivos/gravacoes/" + id, resp));

                        $indexedDB.openStore(GRAVACAODB,function (store) {
                            store.insert({"idPerfil":idPerfil,"idGravacao":id,"raw":resp}).then(function (r) {
                                def.resolve(r);
                            },function (err) {
                                console.error(err);
                            });
                        });
                    }
                },function (err) {
                    console.error(err);
                    def.reject();
                });

                return def.promise;
            };

            var _cacheArquivo=function(){
                var def = $q.defer();
                resourceRest.gravacao.withHttpConfig({responseType: 'blob',fullResponse:true}).get(id).then(function (resp) {
                    console.info("requisicao feita1");
                    if (resp==null && time == 60) {
                        def.reject();
                        return null;
                    }
                    if (resp!=null) {
                        console.info("escrevendo blob");
                        // console.info(fileSystem.writeBlob("arquivos/gravacoes/" + id, resp));

                        $indexedDB.openStore(GRAVACAODB,function (store) {
                            store.insert({"idPerfil":idPerfil,"idGravacao":id,"raw":resp}).then(function (r) {
                                def.resolve(r);
                            });
                        });
                    }
                },function (err) {
                    console.error(err);
                    def.reject();
                });

                return def.promise;
            }


            var getMensagemUrl = function (idPerfil,id) {
                return _getArquivo(idPerfil,id,ARQUIVODB);
            };

            var getArquivoUrl = function (idPerfil,id) {
               return _getArquivo(idPerfil,id,GRAVACAODB);
            };


            var _getArquivo=function (idPerfil,id,banco) {
                var def=$q.defer();
                $indexedDB.openStore(banco, function (store) {
                    store.find(id).then(function (resp) {
                        if(resp.raw) {
                            def.resolve(resp.raw);
                        }else{
                            def.reject();
                        }
                    },function (result) {
                        if(banco==GRAVACAODB) {
                            cacheArquivo(idPerfil, id).then(function (result) {
                                def.resolve(result);
                            });
                        }else{
                            cacheMensagem(idPerfil,id).then(function (result) {
                                def.resolve(result);
                            })
                        }
                    });
                });
                return def.promise;
            };

            var apagarArquivo = function (id) {
                if(arguments[1]==null){
                    var path=GRAVACAODB;
                }else{
                    var path=ARQUIVODB ;
                }
                var def=$q.defer();
                $indexedDB.openStore(path, function(store){
                    store.delete(id).then(function(resp){
                        def.resolve(true);
                    });
                });
                return def.promise;
            };



            var limparCache=function () {
                clearFS();
            };


            return {
                cacheMensagem:cacheMensagem,
                getMensagemUrl:getMensagemUrl,
                cacheArquivo:cacheArquivo,
                getArquivoUrl:getArquivoUrl,
                apagarArquivo:apagarArquivo,
                limparCache:limparCache
            };

        }]);
    return app;
});