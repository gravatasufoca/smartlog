<?php

$route = "/configuracao";

$app->get($route , function () use ($app) {

    $perfil=getSession()["usuario"]["perfil"]["id"];
    if (isset($perfil)) {
        require_once "classes/service/configuracaoService.php";
        $configuracaoService = new ConfiguracaoService();
        try {
            $resp = $configuracaoService->recuperar($perfil);
            echoResponse(200, $resp);
        } catch (Exception $exception) {
            echoResponse(500, $exception->getMessage());
        }
    } else {
        echoResponse(401, 'Configuração não encontrada');
    }
});



?>