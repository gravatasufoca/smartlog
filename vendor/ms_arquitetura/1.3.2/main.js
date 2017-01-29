
if(!appConfig) {
	console.log('Não foi definido um configurador da aplicação.');
	//return;
}
var sufixo = '.min';
var bust = (new Date()).getTime();
var angularVersion="1.5.9";

requirejs.config({
	urlArgs: "bust=" + bust,
	paths: {
		'jQuery': [appConfig.servidor + '/vendor/jquery/2.0.3/jquery'+ sufixo],
		'angular': [appConfig.servidor + '/vendor/angularjs/'+angularVersion+'/angular'+ sufixo],
		'angularSanitize': [appConfig.servidor + '/vendor/angularjs/'+angularVersion+'/angular-sanitize' + sufixo],
		'angularNgCookies': [appConfig.servidor + '/vendor/angularjs/'+angularVersion+'/angular-cookies' + sufixo],
		'angularMediaPlayer': [appConfig.servidor + '/vendor/angular-media-player/angular-media-player'],
		'angularResource': [appConfig.servidor + '/vendor/angularjs/'+angularVersion+'/angular-resource' + sufixo],
		'angularUiBootstrap': [appConfig.servidor + '/vendor/angular-ui-bootstrap/0.9.0/ui-bootstrap-tpls-0.9.0' + sufixo],
		'angularTranslate': [appConfig.servidor + '/vendor/angular-translate/2.0.0/angular-translate' + sufixo],
		'angularTranslatePartialLoader': [appConfig.servidor + '/vendor/angular-translate-loader-partial/0.1.6/angular-translate-loader-partial' + sufixo],
		'angularValidator': [appConfig.servidor + '/vendor/angular-validator/0.1.4/angular-validator' + sufixo ],
		'angularUiRouter':[appConfig.servidor + '/vendor/angular-ui-router/0.2.7/angular-ui-router' + sufixo],
		'angularMaps':[appConfig.servidor + '/vendor/angular-maps/ng-map' + sufixo],
		'restangular':[appConfig.servidor + '/vendor/restangular/1.3.1/restangular' + sufixo],
		'angularBlocks':[appConfig.servidor + '/vendor/angular-blocks/0.1.8/angular-blocks' + sufixo],
		'angularNgTable':[appConfig.servidor + '/vendor/ng-table/0.3.1/ng-table' + sufixo],
		'angularUiUtils':[appConfig.servidor + '/vendor/angular-ui-utils/0.1.1/ui-utils' + sufixo],
		'angularTimer':[appConfig.servidor + '/vendor/angular-timer/1.0.11/angular-timer' + sufixo],
		'moment': [appConfig.servidor + '/vendor/momentjs/2.5.0/moment'+ sufixo],
		'jQueryRvFontsize': [appConfig.servidor + '/vendor/jquery-rv-fontsize/2.0.3/rv-fontsize'+ sufixo],
		'jQueryNoty': [appConfig.servidor + '/vendor/jquery-noty/2.2.1/jquery.noty.packaged' + sufixo],
		'jQueryNotyLayoutsTopCenter': [appConfig.servidor + '/vendor/jquery-noty/2.2.1/layouts/topCenter'],
		'jQueryNotyLayouts': [appConfig.servidor + '/vendor/jquery-noty/2.2.1/layouts'],
		'jQueryNotyThemesDefault': [appConfig.servidor + '/vendor/jquery-noty/2.2.1/themes/default'],
		'domReady' : [appConfig.servidor + '/vendor/requirejs-domready/2.0.1/domReady'+ sufixo],
		'msControllers' : [appConfig.servidor + '/vendor/ms_arquitetura/' + appConfig.versao_arquitetura + '/controladores'],
		'msDirectives' : [appConfig.servidor + '/vendor/ms_arquitetura/' + appConfig.versao_arquitetura + '/diretivas'],
		'bootstrap' : [appConfig.servidor + '/vendor/ms_arquitetura/' + appConfig.versao_arquitetura + '/bootstrap'],
		'msAppJs' : [appConfig.servidor + '/vendor/ms_arquitetura/' + appConfig.versao_arquitetura + '/app'],
		'componentes' : [appConfig.servidor + '/vendor/ms_arquitetura/' + appConfig.versao_arquitetura + '/ms-componentes'],
		'msFilters' : [appConfig.servidor + '/vendor/ms_arquitetura/' + appConfig.versao_arquitetura + '/filtros'],
		'utils' : [appConfig.servidor + '/vendor/ms_arquitetura/' + appConfig.versao_arquitetura + '/utils'],
		'underscore':[appConfig.servidor + '/vendor/underscorejs/1.6.0/underscore' + sufixo],
		'underscore.string':[appConfig.servidor + '/vendor/underscore.string/2.3.2/underscore.string' + sufixo]
	},
	shim: {
		'angular': {
			deps: ['jQuery'],
			exports: 'angular'
		},

		'angularUiBootstrap': {
			deps: ['angular'],
			exports: 'angularUiBootstrap'
		},
		'angularTranslate': {
			deps: ['angular'],
			exports: 'angularTranslate'
		},
		'angularValidator': {
			deps: ['angular'],
			exports: 'angularValidator'
		},
        'angularMediaPlayer': {
            deps: ['angular'],
            exports: 'angularMediaPlayer'
        },
		'underscore': {
			exports: 'underscore'
		},
		'underscore.string': {
			exports: 'underscore.string'
		},
		'angularTranslatePartialLoader': {
			deps: ['angularTranslate'],
			exports: 'angularTranslatePartialLoader'
		},
		'angularSanitize': {
			deps: ['angular'],
			exports: 'angularSanitize'
		},
		'angularNgCookies': {
			deps: ['angular'],
			exports: 'angularNgCookies'
		},
		'angularResource': {
			deps: ['angular'],
			exports: 'angularResource'
		},
		'angularUiRouter': {
			deps: ['angular'],
			exports: 'angularUiRouter'
		},
		'angularNgGrid': {
			deps: ['angular'],
			exports: 'angularNgGrid'
		},
		'angularNgTable': {
			deps: ['angular'],
			exports: 'angularNgTable'
		},
		'angularTimer': {
			deps: ['angular'],
			exports: 'angularTimer'
		},
		'angularBlocks': {
			deps: ['angular'],
			exports: 'angularBlocks'
		},
        'angularMaps': {
            deps: ['angular'],
            exports: 'angularMaps'
        },
		'restangular': {
			deps: ['angular'],
			exports: 'restangular'
		},
		'angularUiUtils': {
			deps: ['angular'],
			exports: 'angularUiUtils'
		},
		'jQueryRvFontsize': {
			deps: ['jQuery'],
			exports: 'jQueryRvFontsize'
		},
		'jQueryNoty': {
			deps: ['jQuery'],
			exports: 'jQueryNoty'
		},
		'jQueryNotyLayoutsTopCenter': {
			deps: ['jQueryNoty'],
			exports: 'jQueryNotyLayoutsTopCenter'
		},
		'jQueryNotyThemesDefault': {
			deps: ['jQueryNoty'],
			exports: 'jQueryNotyThemesDefault'
		},
		'moment': {
			exports: 'moment'
		},
		'utils/contraste': {
			deps: ['jQuery'],
			exports: 'utils/contraste'
		}
//		,'msAppJs' : {
//		exports: 'msAppJs'
//		},
//		'bootstrap' : {
//		exports: "bootstrap",
//		deps: ['msAppJs']
//		}
	}
	,priority: ["angular"]
	,deps: ['bootstrap']
});


requirejs.onError = function (err) {
    /*
        err has the same info as the errback callback:
        err.requireType & err.requireModules
    */
    console.log(err);
    console.log(err.requireType);
    // Be sure to rethrow if you don't want to
    // blindly swallow exceptions here!!!
};

