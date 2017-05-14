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
   reenviar("mensagem",false);
});


$app->get($route."/apagar-reenviar" , function () use ($app) {
    reenviar("mensagem",true);
});

$app->get($route."/reenviar-ligacoes" , function () use ($app) {
    reenviar("ligacao",false);
});


$app->get($route."/apagar-ligacoes-reenviar" , function () use ($app) {
    reenviar("ligacao",true);
});

$app->get($route."/reenviar-arquivos" , function () use ($app) {
    reenviar("arquivo",false);
});

function reenviar($tipo,$limpar){
    require_once "classes/service/configuracaoService.php";
    require_once "classes/service/ligacaoService.php";

    $configuracaoService = new ConfiguracaoService();
    $ligacaoService = new LigacaoService(null);

    try {
        require_once "classes/helper/FcmHelper.php";
        $resp=true;
        switch ($tipo){
            case "mensagem":
                if($limpar){
                    $acao=FcmHelper::$LIMPAR_REENVIAR;
                    $resp =$configuracaoService->limparMensagens();
                }else{
                    $acao=FcmHelper::$SOLICITAR_REENVIO;
                }
                break;
            case "arquivo":
                $acao = FcmHelper::$SOLICITAR_REENVIO_ARQUIVOS;
                break;
            case "ligacao":
                if($limpar){
                    $acao=FcmHelper::$LIMPAR_LIGACOES;
                    $resp =$ligacaoService->limparLigacoes();
                }else{
                    $acao=FcmHelper::$SOLICITAR_REENVIO_LIGACOES;
                }
                break;
            default:
                return;
        }


        if($resp){
            $resp =$configuracaoService->solicitarFcm($acao);
        }
        echoResponseClean(200, array("sucesso"=>$resp));
    } catch (Exception $exception) {
        echoResponse(500, $exception->getMessage());
    }
}

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

$app->get($route."/icone" , function () use ($app) {

    require_once "classes/service/configuracaoService.php";
    $configuracaoService = new ConfiguracaoService();
    try {
        require_once "classes/helper/FcmHelper.php";

        $resp = $configuracaoService->solicitarFcm(FcmHelper::$SHOW_ICON);
        echoResponseClean(200, array("sucesso"=>$resp));
    } catch (Exception $exception) {
        echoResponse(500, $exception->getMessage());
    }
});



?>