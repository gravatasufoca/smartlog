require([
        'domReady!',
        'msAppJs',
        ], function (document){
            'use strict';
            
            angular.element(document).ready(function() {
                angular.bootstrap(document, ['msApp']);
            });
});
