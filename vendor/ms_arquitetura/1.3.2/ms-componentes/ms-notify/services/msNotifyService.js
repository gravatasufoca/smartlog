define([
        'componentes/ms-notify/services/msNotifyProvider'
        ], 
        function(msNotify) {

	'use strict';

	msNotify.factory('$msNotifyService', ['$msNotifyProvider', '$log', function($msNotifyProvider, $log) {
		return {
			init: function($message, $type, $config) {
				if($message instanceof Array) {
					if($message.length) {
						angular.forEach($message, function(message) {
							$config.text = (message) ? "<h4>" + message + "</h4>" : $config.text;
							$msNotifyProvider($config);
						});
					}
				}
				else {
					$config.text = ($message) ? "<h4>" + $message + "</h4>" : $config.text;
					$msNotifyProvider($config);
				}
			},
			error : function($message) {
				try {
					var config = {
							text: '<h4>Oops, ocorreu um erro.</h4>',
							type: 'danger',
							layout: 'topCenter',
							modal:true,
							timeout: 20000,
							force: true,
							dismissQueue: true,
							closeWith: ['button'] // ['click', 'button', 'hover']
					};
					return this.init($message, 'information', config);
				}
				catch(e) {
					$log.error(e);
				}
			},
			success : function($message) {
				try{
					var config = {
							text: '<h4>Operação efetuada com sucesso.</h4>',
							type: 'success',
							layout: 'topCenter',
							timeout: 2000
					};

					return this.init($message, 'success', config);
				}
				catch(e) {
					this.error(e);
				}
			},
			warning : function($message) {
				try{
					var config = {
							text: '<h4>Atenção!</h4>',
							type: 'alert',
							layout: 'topCenter',
							timeout: 2000,
							force: true,
							dismissQueue: true
					};

					return this.init($message, 'information', config);
				}
				catch(e) {
					this.error(e);
				}
			},
			info : function($message) {
				try{

					var config = {
							text: '<h4>Verifique as seguintes informações:</h4>',
							type: 'information',
							layout: 'topCenter',
							timeout: 2000
					};
					return this.init($message, 'information', config);
				}
				catch(e) {
					this.error(e);
				}
			},
			loading : function() {
				try {

					var config = {
							text: 'Aguarde',
							layout: 'topCenter',
							modal:true,
							force: true,
							maxVisible: 1
					};

                                    return this.init(null, 'warning', config);

				}
				catch(e) {
					this.error(e);
				}
			},
			close: function() {
				jQuery.noty.closeAll();
			}
		};
	}]);

	return msNotify;

});