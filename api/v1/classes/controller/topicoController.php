<?php


$route="/topico";

$app->get($route.'/aparelho/:id', function ($id) use ($app) {
    require_once "classes/service/topicoService.php";

    $topicoService = new TopicoService();

    try {
        echoResponse(200, $topicoService->recuperarPorAparelho($id));
    }catch (Exception $exception){
        echoResponse(500, $exception->getMessage());
    }

});


$app->post($route.'/:id', function ($id) use ($app) {
    require_once "classes/service/topicoService.php";

    $topicoService = new TopicoService();
    try {
        echoResponse(200, $topicoService->recuperar($id));
    }catch (Exception $exception){
        echoResponse(500, $exception->getMessage());
    }

});


?>