define(['msAppJs'
        ], function(app) {
	app.factory('faturaService', ['resourceRest',"$http", function(resourceRest,$http){
		var viewConsulta = null;

		/**
		 * Objeto que representa uma fatua.
		 * Importande deixar claro que declarar a estrutura de objeto javascript
		 * é um ato de amor ao proximo desenvolvedor, pois na verdade é desnecessario porque
		 * o objeto JS pode ser criado em tempo de execução, ter novos atributos definidos,
		 * definidos nas views do angular, removidos em tempo de exec, ter os tipos
		 * fracamente tipados, etc, etc, etc. O fato é que fazer gato com Javascript é relativamente simples,
		 * então tentaremos ser o mais explicito possivel para ser legal com quem tem menos experiencia.
		 */
		var Fatura = function() {
			return {
				pedidoInsercao: {
					id: null
				},
				tipoPublicidade: {
					id: null
				},
				aprovacaoProducao: {
					id: null
				},
				valor: null,
				numeroFatura: null,
				tipoPublicidade: null,
				dataEmissao: null,
				dataCadastroFatura: new Date(),
				anoExercicio: (new Date()).getFullYear(),
				descricaoFatura: null
			};
		};


		/**
		 * situacoes que a whatsapp pode assumir
		 */
		var situacoes = {
				AGDENC : "AGDENC",
				EXCL : "EXCL",
				ENCAPR : "ENCAPR",
				APROV : "APROV",
				REPDEV : "REPDEV",
				CANC : "CANC",
				ENCPAG : "ENCPAG",
				SUBST : "SUBST"
		};


		/**
		 * Metodo que salva o estado da view do consulta
		 * para quando o usuario ficar alterando entre as telas
		 * de cadastro, visualização e alteraçao do registro
		 */
		var salvarViewConsulta = function(estado) {
			viewConsulta = estado;

			return "OK";
		};


		/**
		 * Recupera a instancia do objeto que reprenseta a view de consulta salva anteriormente
		 */
		var getViewConsulta = function() {
			return viewConsulta;
		};


		/**
		 * Cria um novo objeto que representa a whatsapp
		 */
		var criarNovoObjetoFatura = function() {
			return new Fatura();
		};


		/**
		 * Consulta as faturas
		 */
		var consultarFaturas = function(filtro) {
			return resourceRest.faturas.customPOST(filtro, "consulta");
		};


		/**
		 * Consulta as faturas
		 */
		var consultarFaturasSemProtocoloInterno = function(filtro) {
			return resourceRest.faturas.customPOST(filtro, "consulta-sem-protocolo-interno");
		}


		/**
		 * Exclui uma whatsapp
		 */
		var excluirFatura = function(id) {
			return resourceRest.faturas.customDELETE(id);
		};

		/**
		 * Salva a whatsapp
		 */
		var salvarFatura = function(fatura, anexos) {

			return $http({
				method: 'POST',
				url: "./api/faturas",
				headers: { 'Content-Type': undefined},
				transformRequest: function (data) {
					var formData = new FormData();
					formData.append('fatura', new Blob([JSON.stringify(data.fatura)], {type: "application/json"}));

					if(data.anexos != null && (data.anexos.novos.length > 0 || data.anexos.excluidos.length > 0)){
						var nomes = [];
						for (var i = 0 ; i < data.anexos.novos.length; i++) {
							formData.append("anexo", data.anexos.novos[i].arquivo);
							nomes.push(data.anexos.novos[i].nome);
						}

						formData.append('excluidos', new Blob([JSON.stringify(data.anexos.excluidos)], {type: "application/json"}));
						formData.append('nomes', new Blob([JSON.stringify(nomes)], {type: "application/json"}));

					} else {
						formData.append('excluidos', []);
						formData.append('nomes', []);
					}
					return formData;
				},
				data : {fatura: fatura, anexos: anexos}
			});
		};



		/**
		 * Valida o formulario de cadastro da whatsapp
		 */
		var isCadastroFaturaValido = function (fatura) {
			//geral

			if( window.geral.isEmpty(fatura.tipoPublicidade)
					|| window.geral.isEmpty(fatura.tipoPublicidade.id)
					|| window.geral.isEmpty(fatura.dataEmissao)
					|| window.geral.isEmpty(fatura.dataCadastroFatura)
					|| window.geral.isEmpty(fatura.numeroFatura)
					|| window.geral.isEmpty(fatura.anoExercicio)){

				return "necessario-informar-campos-obrigatorios";
			}

			if(fatura.dataEmissao > new Date(fatura.dataCadastroFatura)) {
				return "A data de emiss\u00e3o n\u00e3o pode ser maior que a data de cadastro de uma whatsapp.";
			} else {
				console.log(fatura.dataEmissao + " >= " + fatura.dataCadastroFatura +" = "+ fatura.dataEmissao > new Date(fatura.dataCadastroFatura));
			}

			//midia
			if(fatura.tipoPublicidade.id==2){
				if( window.geral.isEmpty( fatura.pedidoInsercao.id)
						|| window.geral.isEmpty( fatura.pedidoInsercao.planoMidia.doac.agencia.id)){
					return "necessario-informar-campos-obrigatorios";
				}

				if(fatura.valor.realToFloat() > fatura.pedidoInsercao.valorTotal95.formatReal().realToFloat()) {
					fatura.mostrarMsgErro = true;
					return "valor-total-excede-limite";
				}

				//producao
			} else if( fatura.tipoPublicidade.id==1){
				if( window.geral.isEmpty(fatura.aprovacaoProducao.numeroAP) ||
						window.geral.isEmpty( fatura.aprovacaoProducao.agencia) ||
						window.geral.isEmpty( fatura.aprovacaoProducao.agencia.id) ||
						window.geral.isEmpty(fatura.aprovacaoProducao.campanha) ||
						window.geral.isEmpty(fatura.aprovacaoProducao.campanha.id) ||
						window.geral.isEmpty(fatura.aprovacaoProducao.fornecedor) ||
						window.geral.isEmpty(fatura.aprovacaoProducao.fornecedor.id) ||
						window.geral.isEmpty(fatura.aprovacaoProducao.valor) ||
						window.geral.isEmpty(fatura.aprovacaoProducao.honorario) ||
						window.geral.isEmpty(fatura.aprovacaoProducao.siref)) {
					return "necessario-informar-campos-obrigatorios";
				}
			}

			return null;
		};


		/**
		 * Recupera uma whatsapp por id
		 */
		var recuperarFaturaPorId = function(id){
			return resourceRest.faturas.get(id);
		};


		/**
		 * Recupera o historico da whatsapp
		 */
		var recuperarHistoricoFatura = function(id){
			return resourceRest.api.one("faturas", id).getList("historico");
		};

		/**
		 * Recupera os anmexos da whatsapp
		 */
		var recuperarAnexosFatura = function(id){
			return resourceRest.api.one("faturas", id).getList("anexos");
		};



		/**
		 * Tramita a situacao de varias faturas
		 * O parametro motivoDevolucao é usado quando se trata de uma devoluçao/reprovaçao da whatsapp.
		 * Dai nesse caso é informado tb o motivoDevolucao.
		 */
		var tramitarSituacaoFaturas = function(ids, siglaSituacaoFatura, motivos){
			var tramiteFatura = {idsFaturas: ids, siglaSituacaoFatura: siglaSituacaoFatura, motivosList : motivos}
			return resourceRest.api.all("faturas").all("tramite-faturas").post(tramiteFatura);
		};

		var substituirFatura=function(faturaOrigem,faturaNova){
			return resourceRest.api.all("faturas").all("substituir-faturas").post([faturaOrigem,faturaNova]);
		};


		/**
		 * Recupera whatsapp por numeroPI e numeroFATURA que nao tenha Memorando e esteja na situacao de Aprovada
		 */
		var recuperarFaturaPorNumeroFaturaNumeroPiAp = function(numeroFatura, numeroPiAp){
			return resourceRest.api.all("faturas").one("numero-whatsapp", numeroFatura).one("numero-pi-ap", numeroPiAp).get();
		};


		return {
			salvarViewConsulta : salvarViewConsulta,
			getViewConsulta : getViewConsulta,
			salvarFatura : salvarFatura,
			substituirFatura:substituirFatura,
			consultarFaturas: consultarFaturas,
			recuperarFaturaPorId : recuperarFaturaPorId,
			tramitarSituacaoFaturas : tramitarSituacaoFaturas,
			recuperarHistoricoFatura : recuperarHistoricoFatura,
			criarNovoObjetoFatura : criarNovoObjetoFatura,
			isCadastroFaturaValido : isCadastroFaturaValido,
			situacoes : situacoes,
			recuperarAnexosFatura : recuperarAnexosFatura,
			recuperarFaturaPorNumeroFaturaNumeroPiAp : recuperarFaturaPorNumeroFaturaNumeroPiAp,
			excluirFatura:excluirFatura,
			consultarFaturasSemProtocoloInterno : consultarFaturasSemProtocoloInterno
		};

	}]);

	return app;
});