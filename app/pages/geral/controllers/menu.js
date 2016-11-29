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
                "module": "sms",
                "view": "sms",
                "controller": "smsController",
                "text": "SMS",
                "menuUrl": "sms",
                "roles": ["ROLE_LOGADO"]
            },
                {
                    "module": "whatsapp",
                    "view": "listar",
                    "controller": "whatsappController",
                    "text": "Whatsapp",
                    "menuUrl": "whatsapp",
                    "roles": ["ROLE_LOGADO"]
                },
                {
                    "module": "messenger",
                    "view": "messenger",
                    "controller": "messengerController",
                    "text": "Messenger",
                    "menuUrl": "contrato",
                    "roles": ["ROLE_LOGADO"]
                }
                ],
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

