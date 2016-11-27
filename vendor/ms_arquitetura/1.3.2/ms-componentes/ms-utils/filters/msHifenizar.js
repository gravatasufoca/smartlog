define([
        'componentes/ms-utils/msUtils',
        ], 
        function(msUtils) {
            'use strict';
            try {
                msUtils.filter('msHifenizar', function() {
                    return function (palavra) {
                        return retira_acentos(palavra.toLowerCase()).replace(/\s/g, "-");
                    };
                });
            }
            catch(e) {
                    $log.error(e);
            }
            
            return msUtils;
			
});