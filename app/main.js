var appConfig = {
		servidor: '..',
		versao_arquitetura: "1.3.2",
		versao_app: '0.1',
		ambiente: {
			nome: 'desenvolvimento',
			exibir: 'true'
		},
		scpa: {
			novo: '${scpa.novoUsuario}',
			esqueceu: '${scpa.trocarSenha}'
		},
		// nome: "SMARTPHONE INSPECTOR",
		nome: 'SISAGUA',
		titulo: "Minist\u00E9rio da Sa\u00FAde",
		subtitulo: "Gest\u00e3o financeira da publicidade",
		appBaseUrl: 'app',
		appContextRoot: 'smartlog',
		url: window.location.protocol+"//"+window.location.hostname+(window.location.port!=""?(":"+window.location.port):""),
		defaultRoute: 'login',
		controllersRoute: '/api/v1',
		login: {
			url: "api/v1/login",
			url_usuario: 'api/v1/login/usuario',
			module: 'login',
			sucesso: 'inicio',
			limite: 30
		},
		logout: {
			url: 'api/v1/logout'
		},
		erros: {
			"_401_" : "Acesso Negado",
			"_403_" : "Acesso Proibido",
			"_500_" : "Ocorreu um erro no servidor",
			"_404_" : "N\u00E3o encontrado"
		}
};


requirejs.config({
	paths: {
		'mainJs': [appConfig.servidor + '/vendor/ms_arquitetura/' + appConfig.versao_arquitetura + '/main', '../vendor/ms_arquitetura/' + appConfig.versao_arquitetura + '/main'],
		'msAppJs':[appConfig.servidor + '/vendor/ms_arquitetura/' + appConfig.versao_arquitetura + '/app', '../vendor/ms_arquitetura/' + appConfig.versao_arquitetura + '/app']
	},
	shim: {
		'msAppJs': {
			deps: ['mainJs']
		}
	},
	deps: ['mainJs', 'msAppJs']
});

require(['msAppJs',
         'pages/geral/geral'
         ], function(app) {
	'use strict';

	/**
	 * Aplicando fontSize ao conteudo
	 */
	jQuery.rvFontsize({
		targetSection: '#content',
		store: false, // store.min.js required! -- false
		controllers: {
			appendTo: '#rvfs-controllers',
			showResetButton: true
		}
	});

	return app;
});
