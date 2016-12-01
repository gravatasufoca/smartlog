<?php


$route="/mensagem";

$app->get($route.'/topico/:id', function ($id) use ($app) {
    require_once "classes/service/mensagemService.php";

    $mensagemService = new MensagemService();

    try {
        echoResponse(200, $mensagemService->recuperarPorTopico($id));
    }catch (Exception $exception){
        echoResponse(500, $exception->getMessage());
    }

});


$app->post($route.'/:id', function ($id) use ($app) {
    require_once "classes/service/mensagemService.php";

    $mensagemService = new MensagemService();
    try {
        echoResponse(200, $mensagemService->recuperar($id));
    }catch (Exception $exception){
        echoResponse(500, $exception->getMessage());
    }

});


?>