define([
        'componentes/ms-grid/msGrid'
        ], 
        function(msGrid) {
            'use strict';
            try {
                
                msGrid.service('msGridService', ['$rootScope', 'ngTableParams', '$filter', '$resource', '$timeout', '$log',
                    function($rootScope, ngTableParams, $filter, $resource, $timeout, $log){
                    
                    
                    this.actions = '';
                    this.setActions = function(actions) {
                        
                    }
                    
                    this.columns = [];
                    
                    this.setColumns = function(content) {
                        this.columns = content.columns;
                        return this.columns;
                    };
                    
                    this.format = function(data, filters) {
                        var newValue;
                        angular.forEach(filters, function(val, key) {
                            newValue =  $filter(val.type)(data, val.formatter);
                        });
                        return newValue;
                    };
                    
                    this.setGridData = function(params, $filter, data, $defer, actions, isResource) {
                        
                        var $this = this;
                        angular.forEach(data, function(val, key) {
                           data[key]['actions'] =  $this.renderActions(val, actions);
                           angular.forEach($this.columns, function(colVal, colKey){
                             
                              if(colVal.content) {
                                  data[key][colVal.field] = colVal.content;
                              }
                              
                              if(colVal.format) {
                                  data[key][colVal.field] = $this.format(data[key][colVal.field], colVal.format);
                              }
                           });
                        });
                        
                        var orderedData = params.sorting() ?
                                                   $filter('orderBy')(data, params.orderBy()) :
                                                   data;
                        
                        orderedData = params.filter() ?
                                                    $filter('filter')(orderedData, params.filter()) :
                                                    orderedData;
                                           
                        if(isResource)
                            $defer.resolve(orderedData);
                        else
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    };
                    
                    this.renderActions = function(data, actions) {
                        
                        var actionHref = '';
                        if(actions) {
                            try{
                                angular.forEach(actions, function(val, key){
                                    name = val.name ? val.name : '';

                                    var ngClick = val.ngClick;

                                    angular.forEach(data, function(v, k) {
                                        var matcher = new RegExp(":" + k, "g");
                                        
                                        ngClick = ngClick.replace(matcher, "'" + data[k] + "'");
                                    });

                                    ngClick = (ngClick) ? ngClick : val.ngClick;

                                    var roles = (val.roles && val.roles.length) ? val.roles : '';
                                        
                                    actionHref += '<a ms-seguranca roles="' + roles + '" class="' + val.style + '" ng-click="' + ngClick + '"><span class="' + val.icon + '"></span>' + name + '</a> ';

                                });
                            }
                            catch(e) {
                                $log.error(e);
                            }
                        }
                        
                        return actionHref;
                    }
                    
                    
                    this.setGrid = function(gridContent, gridId) {
                        try{
                            var $this = this;
                            var data = (gridContent.resource) ? new Array() : gridContent.data;
                            
                            return new ngTableParams(gridContent.config, {
                                                    total: data.length,
                                                    getData: function($defer, params) {
                                                        
                                                        $this.setActions(gridContent.actions);
                                                        
                                                        if(!gridContent.resource) {
                                                           return $this.setGridData(params, $filter, data, $defer);
                                                        }
                                                        else {
                                                            var content = $resource(gridContent.resource);
                                                            content.get(params.url(), function(data) {
                                                                    $timeout(function() {
                                                                        try{
                                                                            if(data.codigo == 400) {
                                                                                throw data.mensagens;
                                                                            }
                                                                            if(data.resultado.dados) {
                                                                                params.total(data.resultado.total);  
                                                                                return $this.setGridData(params, $filter, data.resultado.dados, $defer, gridContent.actions, true);
                                                                            }
                                                                            else {
                                                                                throw "O objeto retornado deve seguir o padrão \n" +
                                                                                        "- resultado.dados \n" + 
                                                                                        "- resultado.pagina\n" + 
                                                                                        "- resultado.itensPorPagina\n" + 
                                                                                        "- resultado.total\n" + 
                                                                                        "- resultado.totalPaginas" ;
                                                                            }
                                                                        }
                                                                        catch(e) {
                                                                            $rootScope.$msNotify.error(e);
                                                                        }
                                                                        
                                                                    }, 500);
                                                            }, function(reason) {
                                                                $rootScope.$msAlert.error(reason.data.mensagens);
                                                            });
                                                        }
                                                    }
                                                });
                        }
                        catch(e) {
                            $rootScope.$msNotify.error(e);
                        }
                    };
                    
                }]);
            }
            catch(e) {
                    $log.error(e);
            }
            
            return msGrid;
			
});