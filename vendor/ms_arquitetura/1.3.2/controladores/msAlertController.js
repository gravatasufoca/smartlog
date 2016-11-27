define([
        'msControllers/msAppController'
        ], 
        function(msAppController) {
            'use strict';
            try {
                
                msAppController.controller('msAlertController', ['$scope', '$attrs', function ($scope, $attrs) {
                    $scope.closeable = 'close' in $attrs;
                }]);
            }
            catch(e) {
                    $log.error(e);
            }
            
            return msAppController;
			
});