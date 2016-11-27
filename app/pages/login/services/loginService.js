define(['msAppJs'], 
		function(app) {
	app.factory("loginService", ['resourceRest', 
	                             '$rootScope', 
	                             '$translatePartialLoader',
	                             function(resourceRest, 
	                            		 $rootScope, 
	                            		 $translatePartialLoader){

		var selecionarPerfil = function(perfil) {
			return resourceRest.login.customPOST(perfil, 'login');
		};

		return {
			selecionarPerfil : selecionarPerfil
		};

	}]);

	return app;
});