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

$app->post($route , function () use ($app) {
    $r = json_decode($app->request->getBody());

    if(isset($r)) {
        $perfil = getSession()["usuario"]["perfil"]["id"];
        if (isset($perfil)) {
            require_once "classes/service/configuracaoService.php";
            $configuracaoService = new ConfiguracaoService();
            try {
                $r->id_aparelho=$perfil;
                echoResponseClean(200, array("sucesso"=>$configuracaoService->salvar($r)));
            } catch (Exception $exception) {
                echoResponseClean(200, array("sucesso"=>"false"));
            }
        } else {
            echoResponse(401, 'Configuração não encontrada');
        }
    }
});



?>