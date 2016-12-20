<?php


$route="/topico";

$app->get($route.'/aparelho/:id/tipo/:tipo/c/:carregados', function ($id,$tipo,$carregado) use ($app) {
    require_once "classes/service/topicoService.php";

    $topicoService = new TopicoService($carregado);

    try {
        echoResponse(200, $topicoService->recuperarPorAparelhoTipo($id,$tipo));
    }catch (Exception $exception){
        echoResponse(500, $exception->getMessage());
    }

});


$app->post($route.'/:id', function ($id) use ($app) {
    require_once "classes/service/topicoService.php";

    $topicoService = new TopicoService();
    try {
        echoResponse(200, $topicoService->recuperarCompleto($id));
    }catch (Exception $exception){
        echoResponse(500, $exception->getMessage());
    }

});


?>