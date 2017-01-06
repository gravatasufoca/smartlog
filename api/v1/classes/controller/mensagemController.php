<?php

$route="/mensagem";

$app->get($route.'/topico/:id/c/:carregados', function ($id,$carregados) use ($app) {
    require_once "classes/service/mensagemService.php";

    $mensagemService = new MensagemService($carregados);

    try {
        echoResponse(200, $mensagemService->recuperarPorTopico($id));
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
            $raw = $mensagemService->solicitarArquivo($id);
        }else {
            $raw = $mensagemService->recuperarArquivo($id);
        }

        if(isset($raw)) {
            echoResponseClean(200, array("success"=>true,"arquivo"=>is_bool($raw)?null:$raw));
        }else{
            echoResponseClean(204, array("success"=>false));
        }
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }
});

?>