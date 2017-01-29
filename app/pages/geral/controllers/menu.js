define([], function () {
    var _menu = [
        {
            "module": "home",
            "view": "home",
            "text": "In\u00EDcio",
            "roles": ["ROLE_LOGADO"]
        },
        {
            "module": "tbas",
            "text": "Mensagens",
            "children": [{
                "module": "mensagens",
                "view": "listar",
                "controller": "mensagensController",
                "text": "SMS",
                "menuUrl": "sms",
                "roles": ["ROLE_LOGADO"]
            },
                {
                    "module": "mensagens",
                    "view": "listar",
                    "controller": "mensagensController",
                    "text": "Whatsapp",
                    "menuUrl": "whatsapp",
                    "roles": ["ROLE_LOGADO"]
                },
                {
                    "module": "mensagens",
                    "view": "listar",
                    "controller": "mensagensController",
                    "text": "Messenger",
                    "menuUrl": "messenger",
                    "roles": ["ROLE_LOGADO"]
                }
            ],
            "roles": ["ROLE_LOGADO"]
        },
        {
            "module": "gravacoes",
            "view": "listarGravacoes",
            "controller": "gravacoesController",
            "text": "Audios",
            "menuUrl": "audios",
            "roles": ["ROLE_LOGADO"]
        },
        {
            "module": "gravacoes",
            "view": "listarGravacoes",
            "controller": "gravacoesController",
            "text": "Videos",
            "menuUrl": "videos",
            "roles": ["ROLE_LOGADO"]
        },{
            "module": "gravacoes",
            "view": "listarGravacoes",
            "controller": "gravacoesController",
            "text": "Fotos",
            "menuUrl": "fotos",
            "roles": ["ROLE_LOGADO"]
        },{
            "module": "localizacoes",
            "view": "listarLocalizacoes",
            "controller": "localizacoesController",
            "text": "Localizações",
            "menuUrl": "localizacoes",
            "roles": ["ROLE_LOGADO"]
        }
    ];

    var obterMenu = function () {
        return _menu;
    };

    return {
        obterMenu: obterMenu
    };
});

