define([
        'componentes/ms-utils/msUtils',
        ], 
        function(msUtils) {
            'use strict';
            try {
                msUtils.filter('msJoin', function () {
                    return function (input,delimiter) {
                        return (input || []).join(delimiter || ',');
                    };
                });
            }
            catch(e) {
                    $log.error(e);
            }
            
            return msUtils;
			
});