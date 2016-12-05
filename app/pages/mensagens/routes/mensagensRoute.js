define([], function(app) {
	var routes = [
        {
            module: 'mensagens',
            view: 'visualizarWhats',
            text: 'Ver mensagens',
            controller : 'visualizarController',
            state: {
                name : "mensagens.visualizar",
                url: "visualizar/:id"
            },
            roles : ['ROLE_LOGADO']
        }
	              ];

	return routes;
});