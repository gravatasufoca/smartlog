<?php


$route="/mensagem";

$app->get($route.'/topico/:id/c/:carregados', function ($id,$carregados) use ($app) {
    require_once "classes/service/mensagemService.php";

    $mensagemService = new MensagemService($carregados);

    try {
        echoResponse(200, $mensagemService->recuperarPorTopico($id));
    }catch (Exception $exception){
        echoResponse(500, $exception->getMessage());
    }

});


$app->post($route.'/:id', function ($id) use ($app) {
    require_once "classes/service/mensagemService.php";

    $mensagemService = new MensagemService(null);
    try {
        echoResponse(200, $mensagemService->recuperar($id));
    }catch (Exception $exception){
        echoResponse(500, $exception->getMessage());
    }
});


$app->get($route.'/imagem/:id/existe', function ($id) use ($app) {
    require_once "classes/service/mensagemService.php";

    $mensagemService = new MensagemService(null);
    try {
        $raw= $mensagemService->imagemExiste($id);
        echoResponse(200, array("existe"=>$raw));
    }catch (Exception $exception){
        echoResponse(500, $exception->getMessage());
    }
});

$app->get($route.'/imagem/:id', function ($id) use ($app) {
    require_once "classes/service/mensagemService.php";

    $mensagemService = new MensagemService(null);
    try {
        $raw= $mensagemService->recuperarImagem($id);
        if(isset($raw)) {
            echoResponse(200, array("imagem"=>$raw));
        }else{
            echoResponse(204, array("imagem"=>null));
        }
    }catch (Exception $exception){
        echoResponse(500, $exception->getMessage());
    }
});


?>