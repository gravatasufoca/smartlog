<?php

$route="/ligacao";

$app->delete($route."/:id", function ($id) use ($app) {
    require_once "classes/service/ligacaoService.php";

    $ligacaoService = new LigacaoService(null);

    try {
        echoResponse(200, $ligacaoService->apagar($id));
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }

});

$app->get($route.'/topico/:id/c/:carregados', function ($id,$carregados) use ($app) {
    require_once "classes/service/ligacaoService.php";

    $ligacaoService = new LigacaoService($carregados);

    try {
        echoResponse(200, $ligacaoService->recuperarPorTopico($id));
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }

});


$app->post($route.'/:id', function ($id) use ($app) {
    require_once "classes/service/mensagemService.php";

    $mensagemService = new MensagemService(null);
    try {
        echoResponse(200, $mensagemService->recuperar($id));
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }
});


$app->get($route.'/arquivo/:id/solicita/:solicitar', function ($id,$solicitar) use ($app) {
    require_once "classes/service/mensagemService.php";

    $mensagemService = new MensagemService(null);
    try {

        if($solicitar=="true") {
            $raw = $mensagemService->recuperarArquivoPorReferencia($id);
            if(!isset($raw) || !isset($raw["raw_data"])) {
                $raw = $mensagemService->solicitarArquivo($id);
            }
        }else {
            $raw = $mensagemService->recuperarArquivoPorReferencia($id);
        }

        if(isset($raw) && isset($raw["raw_data"])) {
            echoResponseClean(200, array("success"=>true,"arquivo"=>is_bool($raw)?null:$raw));
        }else{
            echoResponseClean(204, array("success"=>false));
        }
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }
});

?>