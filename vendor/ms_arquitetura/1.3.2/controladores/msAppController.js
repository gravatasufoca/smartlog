define([
        'angular'
        ], 
        function() {
            'use strict';
            try {
                return angular.module('msAppController', []);;
            }
            catch(e) {
                    $log.error(e);
            }
			
});