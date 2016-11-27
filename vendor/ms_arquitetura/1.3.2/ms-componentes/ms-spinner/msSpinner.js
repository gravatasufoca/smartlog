define([
        'angular'
        ], 
		function() {
			'use strict';
			try {
				return angular.module('msSpinner', []);
			}
			catch(e) {
				$log.error(e);
			}
			
});
   