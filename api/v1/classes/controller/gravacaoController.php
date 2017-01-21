<?php

$route="/gravacao";

$app->get($route.'/aparelho/:id/tipo/:tipo/c/:carregados', function ($id,$tipo,$carregados) use ($app) {
    require_once "classes/service/gravacaoService.php";

    $gravacaoService = new GravacaoService($carregados);

    try {
        echoResponse(200, $gravacaoService->recuperarPorAparelho($id));
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }

});

$app->get($route.'/aparelho/:aparelho/tipo/:tipo/duracao/:duracao', function ($aparelho,$tipo,$duracao) use ($app) {
    require_once "classes/service/gravacaoService.php";

    $gravacaoService = new GravacaoService(null);
    try {
        $id = $gravacaoService->solicitarArquivo($aparelho,$tipo,$duracao);
        if(isset($id)){
            echoResponseClean(200, array("success" => true, "id" =>$id));
        } else{
            echoResponseClean(204, array("success"=>false));
        }
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }
});


$app->get($route.'/:id', function ($id) use ($app) {
    require_once "classes/service/gravacaoService.php";

    $gravacaoService = new GravacaoService(null);
    try {
        echoResponse(200, $gravacaoService->recuperar($id));
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }
});

?>