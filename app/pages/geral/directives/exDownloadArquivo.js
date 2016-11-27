
define(['msAppJs'], function(app) {
	'use strict';

	/**
	 * Para fazer donwloads de arquivos da consulta usando token de acesso
	 */
	app.directive('exDownloadArquivo', ["msSegurancaService",
	                                    function (msSegurancaService) {
		return {
			restrict: 'A',
			replace: true,
			scope: {
				data : '=',
				idRegistro: "="
			},
			link: function(scope, element, attrs) {
				element.on('click', function(event) {
					var token = msSegurancaService.getToken();
					var url = attrs.url;
					var data = scope.data;

					if (url) { //verifica se existe a url obrigatoriamente
						var inputs = '';
						var form = $('<form action="./api/'+url+'" method="post" target="_blank"></body>');

						if(data) {
							data = typeof data == 'string' ? data : jQuery.param(data);
							data = data.replace(/\+/g, "%20");
							data = decodeURIComponent(data);

							jQuery.each(data.split('&'), function(){
								var pair = this.split('=');
								if(pair[1].length > 0){
									inputs+='<input type="hidden" name="'+ (pair[0].replace(/\[/g,".").replace(/\]/g,"")) +'" value="'+ pair[1] +'" />';
								}
							});
						}

						inputs += '<input type="hidden" name="token" value="'+token+'" id="token">';

						$(form).append(inputs);
						$("body").append(form);
						form.submit();
						$("body").remove(form);
					}
				});
			}
		};
	}]);
});