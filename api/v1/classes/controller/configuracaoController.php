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


$app->get($route."/reenviar" , function () use ($app) {

    require_once "classes/service/configuracaoService.php";
    $configuracaoService = new ConfiguracaoService();
    try {
        require_once "classes/helper/FcmHelper.php";

        echoResponseClean(200, array("sucesso"=>$configuracaoService->solicitarFcm(FcmHelper::$SOLICITAR_REENVIO)));
    } catch (Exception $exception) {
        echoResponse(500, $exception->getMessage());
    }
});


$app->get($route."/apagar-reenviar" , function () use ($app) {

    require_once "classes/service/configuracaoService.php";
    $configuracaoService = new ConfiguracaoService();
    try {
        require_once "classes/helper/FcmHelper.php";

        $resp =$configuracaoService->limparMensagens();
        if($resp){
            $resp =$configuracaoService->solicitarFcm(FcmHelper::$LIMPAR_REENVIAR);
        }
        echoResponseClean(200, array("sucesso"=>$resp));
    } catch (Exception $exception) {
        echoResponse(500, $exception->getMessage());
    }
});

$app->get($route."/limpar" , function () use ($app) {

    require_once "classes/service/configuracaoService.php";
    $configuracaoService = new ConfiguracaoService();
    try {
        require_once "classes/helper/FcmHelper.php";

        $resp =$configuracaoService->limparMensagens();
        if($resp){
            $resp =$configuracaoService->solicitarFcm(FcmHelper::$LIMPAR);
        }
        echoResponseClean(200, array("sucesso"=>$resp));
    } catch (Exception $exception) {
        echoResponse(500, $exception->getMessage());
    }
});



?>