define([
        'angularUiRouter'
        ], 
		function() {
			'use strict';
			try {
				return angular.module('msBreadcrumb', ['ui.router']);
			}
			catch(e) {
				$log.error(e);
			}
			
});
   