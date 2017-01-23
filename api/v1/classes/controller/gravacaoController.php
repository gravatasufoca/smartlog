<?php

$route="/gravacao";

$app->get($route.'/aparelho/:id/tipo/:tipo/c/:carregados', function ($id,$tipo,$carregados) use ($app) {
    require_once "classes/service/gravacaoService.php";
    require_once "classes/helper/FcmHelper.php";

    $gravacaoService = new GravacaoService($carregados);

    try {
        echoResponse(200, $gravacaoService->recuperarPorAparelho($id,$tipo));
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }

});

$app->get($route.'/aparelho/:aparelho/tipo/:tipo/duracao/:duracao', function ($aparelho,$tipo,$duracao) use ($app) {
    require_once "classes/service/gravacaoService.php";
    require_once "classes/helper/FcmHelper.php";

    $gravacaoService = new GravacaoService(null);
    try {
        $tipo=$tipo==1 ||$tipo=="1"?FcmHelper::$OBTER_VIDEO:FcmHelper::$OBTER_AUDIO;
        $id = $gravacaoService->solicitarArquivo($aparelho,$tipo,$duracao);
        if(isset($id)){
            echoResponse(200, $gravacaoService->recuperar($id));
        } else{
            echoResponse(200, array());
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

$app->delete($route.'/gravacao/:id', function ($id) use ($app) {
    require_once "classes/service/gravacaoService.php";

    $gravacaoService = new GravacaoService(null);
    try {
        echoResponseClean(200, $gravacaoService->deletar($id));
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }
});

?>