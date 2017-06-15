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
    debug("nova solicitacao");
    debug(getSession());
    $gravacaoService = new GravacaoService(null);
    try {
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
    debug("pedindo arquivo:");
    $response=$app->response;
    require_once "classes/service/gravacaoService.php";
    $gravacaoService = new GravacaoService(null);
    $resp=$gravacaoService->recuperarArquivo($id);
    if(isset($resp)){
        $response->write($resp["file"]);
        $response->headers->set('Content-Transfer-Encoding', 'binary');
        $response->headers->set('Content-Type', $resp["mime"]);
        $response->headers->set('Content-Length', $resp["size"]);
        $response->headers->set('Accept-Ranges', 'bytes');
        $response->headers->set('Content-Range', 'bytes 100-'.($resp["size"]-1)."/*");
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