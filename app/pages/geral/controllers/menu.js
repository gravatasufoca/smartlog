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
            "module": "audios",
            "view": "listarAudios",
            "controller": "audiosController",
            "text": "Audios",
            "menuUrl": "audios",
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

