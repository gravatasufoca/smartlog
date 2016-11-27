define([], function() {
	var _menu = [
	             {
	            	 "module": "home",
	            	 "view": "home",
	            	 "text": "In\u00EDcio",
	            	 "roles" : ["ROLE_LOGADO"]
	             },
	             {
	            	 "module": "tbas",
	            	 "text": "Cadastros b\u00E1sicos",
	            	 "children": [{
	            		 "module" : "agencia",
	            		 "view" : "consultarAgencia",
	            		 "controller" : "consultarAgenciaController",
	            		 "text" : "Ag\u00EAncia de publicidade",
	            		 "menuUrl" : "agencia",
	            		 "roles": ["ROLE_AGENP"]
	            	 },
	            	 {
	            		 "module" : "campanha",
	            		 "view" : "consultarCampanha",
	            		 "controller" : "consultarCampanhaController",
	            		 "text" : "Campanha",
	            		 "menuUrl" : "campanha",
	            		 "roles": ["ROLE_CAMPA"]
	            	 },
	            	 {
	            		 "module" : "contrato",
	            		 "view" : "consultarContrato",
	            		 "controller" : "consultarContratoController",
	            		 "text" : "Contrato de publicidade",
	            		 "menuUrl" : "contrato",
	            		 "roles": ["ROLE_CONTR"]
	            	 },
	            	 {
	            		 "module": "empenho",
	            		 "view": "consultarEmpenho",
	            		 "controller" : "consultarEmpenhoController",
	            		 "text": "Empenho",
	            		 "menuUrl" : "empenho",
	            		 "roles": ["ROLE_EMPEN"]
	            	 },
	            	 {
	            		 "module" : "fornecedor",
	            		 "view" : "consultarFornecedor",
	            		 "controller" : "consultarFornecedorController",
	            		 "text" : "Fornecedor",
	            		 "menuUrl" : "fornecedor",
	            		 "roles": ["ROLE_FORNE"]
	            	 },
	            	 {
	            		 "module" : "motivoDevolucao",
	            		 "view" : "consultarMotivoDevolucao",
	            		 "controller" : "consultarMotivoDevolucaoController",
	            		 "text" : "Motivo de devolu\u00E7\u00E3o",
	            		 "menuUrl" : "motivo-devolucao",
	            		 "roles": ["ROLE_MODEV"]
	            	 },
	            	 {
	            		 "module" : "orcamento",
	            		 "view" : "consultarOrcamento",
	            		 "controller" : "consultarOrcamentoController",
	            		 "text" : "Or\u00E7amento",
	            		 "menuUrl" : "orcamento",
	            		 "roles": ["ROLE_ORCAM"]
	            	 }],
	            	 "roles": ["ROLE_MODEV",
	            	           "ROLE_AGENP",
	            	           "ROLE_CONTR",
	            	           "ROLE_FORNE",
	            	           "ROLE_CAMPA",
	            	           "ROLE_APROV",
	            	           "ROLE_ORCAM",
	            	           "ROLE_EMPEN"]
	             },
	             {
	            	 "module": "principal",
	            	 "text": "Principal",
	            	 "children": [{
	            		 "module": "doac",
	            		 "view": "consultarDoac",
	            		 "controller": "consultarDoacController",
	            		 "text": "DOAC",
	            		 "menuUrl" : "doac",
	            		 "roles" : ["ROLE_DOAC"]
	            	 },
	            	 {
	            		 "module": "fatura",
	            		 "view": "consultarFatura",
	            		 "controller" : "consultarFaturaController",
	            		 "text": "Fatura",
	            		 "menuUrl" : "fatura",
	            		 "roles" : ["ROLE_FATUR"]
	            	 },
	            	 {
	            		 "module": "memorando",
	            		 "view": "consultarMemorando",
	            		 "controller" : "consultarMemorandoController",
	            		 "text": "Memorando",
	            		 "menuUrl" : "memorando",
	            		 "roles" : ["ROLE_MEMOR"]
	            	 }],
	            	 "roles": ["ROLE_DOAC",
	            	           "ROLE_FATUR",
	            	           "ROLE_MEMOR"]
	             },
	             {
	            	"module" : "protocolo",
	            	"text" : "Protocolo",
	            	"children" : [{
	            		"module": "protocoloInterno",
	            		 "view": "consultarProtocoloInterno",
	            		 "controller" : "consultarProtocoloInternoController",
	            		 "text": "Protocolo Interno",
	            		 "menuUrl" : "protocolo-interno",
	            		 "roles" : ["ROLE_PROTI"]
	            	},
	            	{
	            		 "module": "protocoloExterno",
	            		 "view": "consultarProtocoloExterno",
	            		 "controller" : "consultarProtocoloExternoController",
	            		 "text": "Protocolo Externo",
	            		 "menuUrl" : "protocolo-externo",
	            		 "roles" : ["ROLE_PROTI"]
	            	}],
	            	"roles": ["ROLE_PROTI"]
	             }];

	var obterMenu = function(){
		return _menu;
	};

	return {
		obterMenu : obterMenu
	};
});


