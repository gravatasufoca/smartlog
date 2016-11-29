define([], function(app) {
	var routes = [
        {
            module: 'whatsapp',
            view: 'visualizarWhats',
            text: 'Ver mensagens',
            controller : 'visualizarController',
            state: {
                name : "whatsapp.visualizar",
                url: "visualizar/:id"
            },
            roles : ['ROLE_LOGADO']
        }
	              ];

	return routes;
});