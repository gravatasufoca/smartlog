define([
        'componentes/ms-utils/msUtils',
        'ckeditor'
        ], 
        function(msUtils) {
            'use strict';
            
            msUtils.directive('msCkeditor', ['$parse', function($parse) {
                    return {
                        require: '?ngModel',
                        link: function(scope, elm, attr, ngModel) {
                            
                            var ckGetter = $parse(attr.msCkeditor);
                            
                            var ck = CKEDITOR.replace(elm[0], ckGetter(scope));
                            
                            
                          if (!ngModel) return;

                          ck.on('instanceReady', function() {
                            ck.setData(ngModel.$viewValue);
                          });

                          function updateModel() {
                              scope.$apply(function() {
                                  ngModel.$setViewValue(ck.getData());
                              });
                          }

                          ck.on('change', updateModel);
                          ck.on('key', updateModel);
                          ck.on('dataReady', updateModel);

                          ngModel.$render = function(value) {
                            ck.setData(ngModel.$viewValue);
                          };
                        }
                      };
                }]);
            return msUtils;
			
});