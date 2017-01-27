<?php

$route="/gravacao";

$app->get($route.'/data/:data/aparelho/:id/tipo/:tipo/c/:carregados', function ($data,$id,$tipo,$carregados) use ($app) {
    require_once "classes/service/gravacaoService.php";

    $gravacaoService = new GravacaoService($carregados);

    try {
        echoResponse(200, $gravacaoService->recuperarPorAparelho($data,$id,$tipo));
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }

});

$app->get($route.'/topico/aparelho/:id/tipo/:tipo', function ($id,$tipo) use ($app) {
    require_once "classes/service/gravacaoService.php";

    $gravacaoService = new GravacaoService(null);

    try {
        echoResponse(200, $gravacaoService->recuperarTopicosPorAparelho($id,$tipo));
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }

});


$app->get($route.'/aparelho/:aparelho/tipo/:tipo/duracao/:duracao/cameraFrente/:cameraFrente', function ($aparelho,$tipo,$duracao,$cameraFrente) use ($app) {
    require_once "classes/service/gravacaoService.php";
    require_once "classes/helper/FcmHelper.php";

    $gravacaoService = new GravacaoService(null);
    try {
        $tipo=$tipo==1 ||$tipo=="1"?FcmHelper::$OBTER_VIDEO:FcmHelper::$OBTER_AUDIO;
        $id = $gravacaoService->solicitarArquivo($aparelho,$tipo,$duracao,$cameraFrente);
        if(isset($id)){
            echoResponse(200, $gravacaoService->recuperar($id));
        } else{
            echoResponseClean(500, array("mensagens"=>"Não foi possível solicitar a gravação."));
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