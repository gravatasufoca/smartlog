define([
        'componentes/ms-utils/msUtils',
        'underscore',
        'underscore.string'
        ], 
		function(msUtils) {
		
		'use strict';
	    
		msUtils.factory('_', function() {
                    return window._; 
                });
		
		return msUtils;
		
});