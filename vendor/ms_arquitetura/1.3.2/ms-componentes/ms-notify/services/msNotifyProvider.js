define([
        'componentes/ms-notify/msNotify'
        ], 
		function(msNotify) {
		
		'use strict';
	    
		msNotify.factory('$msNotifyProvider', function() {
	        try {
	           return function(){
	               return noty(arguments[0]);
	           };
	        }
	        catch(e) {
	        	$log.error(e);
	        }
	    });
		
		return msNotify;
		
});