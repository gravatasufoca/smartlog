define([
        'componentes/ms-grid/services/msGridService',
        ], 
		function(msGrid) {
		'use strict';
                
                msGrid.directive('msGrid', ['ngTableParams', '$filter', '$resource', '$timeout', 'msGridService', '$compile', '$parse', 
                    function(ngTableParams, $filter, $resource, $timeout, msGridService, $compile, $parse) {
                   
                   return{
                            restrict: 'E',
                            scope: true,
                            link: function(scope, element, attrs, ctrl) {
                                try {
                                    
                                    scope.$watch(attrs.gridData, function(content) {
                                        if(content) {
                                            var gridId = attrs.id;
                                            var gridColumns = gridId + 'Columns';
                                            
                                            $timeout(function(){
                                                //Parse das colunas, atribuindo os valores ao scope
                                                $parse(gridColumns).assign(scope, msGridService.setColumns(content));
                                                //parse da grid, atribuindo os valores ao scope atual e ao scope PAI, para poder recuperar o objeto da table
                                                var gridParams = msGridService.setGrid(content, gridId);
                                                var gridParser = $parse(gridId);
                                                gridParser.assign(scope, gridParams);
                                                gridParser.assign(scope.$parent, gridParams);
                                                
                                                //Aplicando as alterações ao scope atual e ao parent
                                                scope.$apply(); 
                                                scope.$parent.$apply();
                                                
                                                var template = angular.element(
                                                        '<ms-loading-spinner loader="' + gridId + '.settings().$loading"> \n\
                                                            <table ng-table="' + gridId + '" class="table">\n\
                                                                <thead>\n\
                                                                    <tr>\n\
                                                                        <th ng-repeat="column in ' + gridId + 'Columns" ng-show="column.visible"\n\
                                                                            class="text-center sortable" ng-class="{\n\
                                                                            \'sort-asc\': ' + gridId + '.isSortBy(column.field, \'asc\'),\n\
                                                                            \'sort-desc\': ' + gridId + '.isSortBy(column.field, \'desc\')\n\
                                                                             }"\n\
                                                                            ng-click="' + gridId + '.sorting(column.field, ' + gridId + '.isSortBy(column.field, \'asc\') ? \'desc\' : \'asc\')">\n\
                                                                            <div>{{column.title}}</div>\n\
                                                                        </th>\n\
                                                                    </tr>\n\
                                                                </thead>\n\
                                                                <tbody>\n\
                                                                    <tr ng-if="' + gridId + '.total() == 0"><td colspan="{{ ' + gridColumns + '.length }}">Nenhum registro encontrado</td></tr>\n\
                                                                    <tr ng-repeat="(index, content) in $data" index="{{index}}">\n\
                                                                        <td ng-repeat="(columnIndex, column) in ' + gridId + 'Columns " ng-class="{{ column.ngClass }}" ng-show="column.visible" sortable="column.field" ms-compile="content[column.field]" >\n\
                                                                         \n\
                                                                        </td>\n\
                                                                    </tr>\n\
                                                                </tbody>\n\
                                                            </table>\n\
                                                        </ms-loading-spinner>');



                                                element.html( template );
                                                $compile(element.contents())(scope);
                                                var table = element.find('.ng-table');
                                                var templateCounter = angular.element("<div class='total-registros'><div ng-if='" + gridId + ".total() > 0' >Exibindo {{ ((" + gridId + ".count()*" + gridId + ".page()) - " + gridId + ".count() + 1) }} a {{ (" + gridId + ".count()*" + gridId + ".page() > " + gridId + ".total()) ? " + gridId + ".total() : (" + gridId + ".count()*" + gridId + ".page()) }} de {{ " + gridId + ".total() }}</div></div>");
                                                $compile(templateCounter)(scope);
                                                table.after(templateCounter);
                                                
                                            }, true);
                                        }
                                        
                                    }, true);
                                    
                                }
                                catch(e) {
                                    scope.$msNotify.error(e);
                                }
                            }
                    };
                        
                }]);
            
            return msGrid;
                
});
   