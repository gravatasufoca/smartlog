define(['msAppJs'], function(app) {
	'use strict';

	app.controller('testeController', ['$scope',
	                                   'ngTableParams',
	                                   '$msNotifyService',
	                                   'msModalService',
	                                   '$timeout',
	                                   '$translatePartialLoader',
	                                   '$state',
	                                   '$stateParams',
	                                   function($scope,
	                                		   ngTableParams,
	                                		   $msNotifyService,
	                                		   msModalService,
	                                		   $timeout,
	                                		   $translatePartialLoader,
	                                		   apoioService,
	                                		   agenciaService,
	                                		   contratoService,
	                                		   $state,
	                                		   $stateParams){

		$translatePartialLoader.addPart('teste');


		$scope.meios = [
		                {id:1, descricao:'Teste1'},
		                {id:2, descricao:'Teste2'},
		                {id:3, descricao:'Teste3'},
		                {id:4, descricao:'Teste4'},
		                {id:5, descricao:'Teste5'},
		                ];
		
		$scope.meiosSelecionados = [];
	}]);		

	return app;
});