define(['msAppJs',
        'pages/fatura/services/faturaService',], function(app) {
	'use strict';

	//Diretiva para reuso do codigo de exibição dos dados do pi / doac
	app.directive('exVisualizarHistoricoFatura', ['faturaService',
	                                              'ngTableParams',
	                                              function(faturaService,
	                                            		  ngTableParams) {

		function link(scope, element, attrs) {

			/**
			 * Fica observando quando a whatsapp muda de valor e recarrega os dados de historico
			 */
			scope.$watch("fatura", function(newVal, oldVal) {
				if(newVal) {
					carregarListaHistorico();
				}
			});


			/**
			 * Carrega a lista de historico
			 */
			var carregarListaHistorico = function() {
				faturaService.recuperarHistoricoFatura(scope.fatura.id)
				.then(function(s) {
					console.log(s.resultado);
					scope.historicoFaturaList = s.resultado;
					carregarTabelaHistoricoFatura();
				});
			}


			/**
			 * Carrega a tabela de historico da whatsapp que é exibida na tela
			 */
			var carregarTabelaHistoricoFatura = function() {
				scope.tabelaHistoricoFatura = new ngTableParams({
					page: 1,
					count: 10
				}, {
					total: 0,
					getData: function($defer, params) {
						var dados = (scope.historicoFaturaList);
						var dadosPaginaAtual = dados.slice((params.page() - 1) * params.count(), params.page() * params.count());

						params.total(dados.length);
						$defer.resolve(dadosPaginaAtual);
					}
				});
			};

		}

		return {
			restrict: 'E',
			replace: true,
			link: link,
			template: function(element, a) {
				var template =
					'<div class="{{tamanhoSpan}} pull-down10" ng-show="historicoFaturaList.length > 0"> '+
					'	<div class="filder panel panel-default"> '+
					'		<div class="panel-heading"> '+
					'			<b class="panel-title">{{\'historico-tramitacao-whatsapp\' | translate}}</b> '+
					'		</div> '+
					'		<div class="panel-body table-panel" loading-container="tabelaHistoricoFatura.settings().$loading" > '+
					'			<table ng-table="tabelaHistoricoFatura" '+
					'				class="tableHead12 table table-striped table-bordered"> '+
					'				<tbody> '+
					'					<tr ng-repeat="hf in $data"> '+
					'						<td class="centeredColumnXY" data-title="\'data-acao\' | translate">{{hf.dataHistoricoFatura | date: \'dd/MM/yyyy HH:mm:ss\'}}</td> '+
					'						<td class="centeredColumnXY" data-title="\'nome-usuario\' | translate">{{hf.nomeUsuario}}</td> '+
					'						<td class="centeredColumnXY" data-title="\'situacao-whatsapp\' | translate">{{hf.descricao != null ? hf.descricao : hf.situacaoFatura.descricao}}  '+
					'							<a ng-show="hf.motivosDevolucaoString" tooltip="{{hf.motivosDevolucaoString}}"><i class="font15px fa fa-question-circle"></i></a></td> '+
					'						<td class="centeredColumnXY" data-title="\'protocolo\' | translate">{{hf.numeroProtocolo}}</td> '+
					'					</tr> '+
					'				</tbody> '+
					'			</table> '+
					'			<div class="clearfix"></div> '+
					'		</div> '+
					'	</div> '+
					'</div> ';
				return template;

			},
			scope: {
				tamanhoSpan : "=",
				fatura : "=",
			}
		};
	}]);

	return app;
});