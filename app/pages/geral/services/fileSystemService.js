define(['msAppJs'], function(app) {
    app.factory('fileSystemService', ['$q',
        '$http',
        '$rootScope',
        'resourceRest',
        'fileSystem',
        function($q,
                 $http,
                 $rootScope,
                 resourceRest,fileSystem){
            
            var writeVal = function() {
                fileSystem.writeText(txtFileName, $window.prompt('Enter message to write', 'Hello World')).then(function(fs) {
                    $scope.messages.push("data written");
                }, function(err) {
                    console.log(err);
                    $window.alert(err.text);
                });
            };

            var readVal = function() {
                fileSystem.readFile(txtFileName).then(function(contents) {
                    $scope.messages.push(contents);
                }, function(err) {
                    console.log(err);
                    $window.alert(err.text);
                });
            };

            var getUsageInfo = function() {
                fileSystem.getCurrentUsage().then(function(usage) {
                    console.info(usage.used + " / " + usage.quota);
                }, function(err) {
                    console.log(err);
                    $window.alert(err.text);
                });
            };

            var requestIncrease = function() {
                fileSystem.requestQuota(150).then(function(newQuota) {
                    console.info("New quota: " + (newQuota/1024/1024) + "mb");
                }, function(err) {
                    console.log(err);
                    $window.alert(err.text);
                });
            };

            var getFiles = function(dir) {
                fileSystem.getFolderContents(dir).then(function(entries) {
                    for(var i = 0; i<entries.length; i++) {
                        console.info(entries[i].fullPath);
                    }
                }, function(err) {
                    console.log(err);
                    $window.alert(err.text);
                });
            };

            var deleteFile = function(path) {
                fileSystem.deleteFile(path).then(function() {
                    $scope.messages.push(path + " deleted");
                }, function(err) {
                    console.log(err);
                    $window.alert(err.text);
                });
            };

            var deleteFolder = function(path, recursive) {
                fileSystem.deleteFolder(path, recursive).then(function() {
                    $scope.messages.push(path + " deleted");
                }, function(err) {
                    console.log(err);
                    $window.alert(err.text);
                });
            };

            var clearFS = function() {
                fileSystem.getFolderContents('/').then(function(entries) {
                    var deletePromises = [];

                    for(var i = 0; i<entries.length; i++) {
                        var p;
                        var e = entries[i];

                        if(e.isDirectory) {
                            p = fileSystem.deleteFolder(e.fullPath, true);
                        } else {
                            p = fileSystem.deleteFile(e.fullPath);
                        }

                        deletePromises.push(p);
                    }

                    return $q.all(deletePromises);
                }).then(function() {
                    console.info("Filesystem Cleared.");
                }, function(err) {
                    console.log(err);
                });
            };


            var cacheMensagem = function(id,tipo) {
                var def = $q.defer();

                resourceRest.mensagem.one("arquivo", id).withHttpConfig({responseType: 'blob'}).get().then(function (resp) {
                    console.info(fileSystem.writeBlob("arquivos/" + id, resp));
                    def.resolve(true);

                },function (err) {
                    def.reject();
                });
                return def.promise;
            };

            var cacheArquivo = function(id) {
                var def = $q.defer();
                resourceRest.gravacao.withHttpConfig({responseType: 'blob'}).get(id).then(function (resp) {
                    if (resp==null && time == 60) {
                        def.reject();
                        return null;
                    }
                    if (geral.isEmpty(resp)) {
                        return recuperarGravacao(id, time + 10);
                    } else {
                        console.info(fileSystem.writeBlob("arquivos/gravacoes/" + id, resp));
                        def.resolve(true);
                    }
                },function (err) {
                    def.reject();
                });

                return def.promise;
            };

            var saveFileInput = function() {
                var f = document.querySelector('#fileInput').files[0];

                fileSystem.writeFileInput(f.name, f, "text/html").then(function() {
                    $scope.messages.push("Copied file to FileSystem");
                }, function(err) {
                    console.log(err);
                });
            };

            var createFolder = function(path) {
                fileSystem.createFolder(path).then(function(dirEntry) {
                    console.info(dirEntry.fullPath);
                }, function(err) {
                    console.log(err);
                });
            };

            var getMensagemUrl = function (id) {
                return getArquivoUrl(id,true);
            };

            var getArquivoUrl = function (id) {
                if(arguments[1]==null){
                    var path="/gravacoes";
                }else{
                    var path="";
                }
                var def=$q.defer();
                fileSystem.getFileEntry("arquivos"+path+ "/"+id).then(function (entry) {
                    def.resolve(entry);
                },function (err) {
                    def.reject();
                });
                return def.promise;
            };

            var getFileFromLocalFileSystemURL=function (url) {
              return fileSystem.getFileFromLocalFileSystemURL(url);
            };

            return {
                writeVal : writeVal,
                readVal : readVal,
                getUsageInfo : getUsageInfo,
                requestIncrease:requestIncrease,
                getFiles:getFiles,
                deleteFile:deleteFile,
                deleteFolder:deleteFolder,
                clearFS:clearFS,
                cacheMensagem:cacheMensagem,
                saveFileInput:saveFileInput,
                createFolder:createFolder,
                getMensagemUrl:getMensagemUrl,
                cacheArquivo:cacheArquivo,
                getArquivoUrl:getArquivoUrl,
                getFileFromLocalFileSystemURL:getFileFromLocalFileSystemURL,
                fileSystem:fileSystem
            };

        }]);
    return app;
});