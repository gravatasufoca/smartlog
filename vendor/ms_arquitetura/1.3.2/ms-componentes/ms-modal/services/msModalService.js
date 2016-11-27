define([
        'componentes/ms-modal/msModal'
        ], 
        function(msModal) {

	'use strict';

	msModal.service('msModalService', ['$modal', '$http', '$compile', function($modal, $http, $compile) {

		'use strict';

		/**
		 * @FIXME Alterei essa classe para resetar dados das modais antes de exibir novas modais,
		 * pois estava acontecendo de mostrar dados de modais antigas quando tentava-se abrir novas modais.
		 */
		var DefaultConfig = function(){
			return {
				backdrop: true,
				keyboard: true,
				modalFade: true
				,template: '<div class="modal-content">' + 
				'<div class="modal-header">' + 
				'<button type="button" class="close" ng-click="$close()" data-dismiss="modal" aria-hidden="true">&times;</button>' +
				'<h4 class="modal-title">{{ data.title }}</h4>' +
				'</div>' +
				'<ms-alert></ms-alert>' +
				'<div class="modal-body" ms-compile="data.content"></div>' +
				'<div class="modal-footer">' +
				'<button type="button" ng-show="{{data.showCloseButton}}" class="btn btn-warning" ng-click="$close()" data-dismiss="modal" ><i class="font15px fa fa-times"></i> {{data.labelButtonClose}}</button>' +
				'<button type="button" class="{{ button.style }}" ng-click="button.ngClick()" ng-repeat="button in data.buttons"><i class="{{button.icon}}"></i> {{ button.name }}</button>' +
				'</div>' +
				'</div>'

				//,templateUrl: requirejs.s.contexts._.config.paths.componentes + '/ms-modal/views/simple.html'
			};
		};


		this.config = new DefaultConfig();

		this.options = {
				title: 'Modal title',
				content: '',
				showCloseButton: true,
				labelButtonClose: 'Cancelar',
				buttons: {
				}
		};

		this.setOptions = function(options) {
			this.config = new DefaultConfig(); //reseta os dados da modal antes de receber a config
			this.options = options;
			return this;
		};

		this.setConfig = function(config) {
			this.config = new DefaultConfig(); //reseta os dados da modal antes de receber a config
			angular.extend(this.config, config);
			return this;
		};

		this.modalInstance = '';

		this.init = function(config, options) {

			var modalOptions = this.options;
			var $this = this;
			//Se o conteudo for object, executo o HTTP.
			if(typeof(this.options.content) == "object") {
				$http({method: $this.options.content.method, url: $this.options.content.url }).
				success(function(data, status, headers, config) {
					modalOptions.content.success(data, status, headers, config);
					modalOptions.content = data;
					$this.setOptions(modalOptions);
				}).
				error(function(data, status, headers, config) {
					modalOptions.content.error(data, status, headers, config);
					$this.setOptions(modalOptions);
				});
			}
			else {
				//Se o conteudo vem de um template na página. Caso contrário, é conteúdo textual e será exibido diretamente.
				if($this.options.content.match(/^#/g)) {
					var element = angular.element($this.options.content);
					if(angular.isElement(element)) {
						var scope = element.scope();
						modalOptions.content = $compile(element.html())(scope);
						this.setOptions(modalOptions);
					}
				}
			}

			if (!$this.config.controller) {
				$this.config.controller = function ($scope, $modalInstance) {
					$scope.data = $this.options;
				};
			}

			return this.modalInstance = $modal.open(this.config);
		};

		this.open = function() {
			this.init().result;
		}

		this.close = function() {
			this.modalInstance.close();
		}

	}]);

	return msModal;

});