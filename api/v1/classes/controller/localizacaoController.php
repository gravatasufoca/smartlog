<?php

$route="/localizacao";

$app->get($route.'/data/:data/aparelho/:id/c/:carregados', function ($data,$id,$carregados) use ($app) {
    require_once "classes/service/localizacaoService.php";

    $localizacaoService = new LocalizacaoService($carregados);

    try {
        echoResponse(200, $localizacaoService->recuperarPorAparelho($data,$id));
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }

});

$app->get($route.'/topico/aparelho/:id', function ($id) use ($app) {
    require_once "classes/service/localizacaoService.php";

    $localizacaoService = new LocalizacaoService(null);

    try {
        echoResponse(200, $localizacaoService->recuperarTopicosPorAparelho($id));
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }

});

$app->get($route.'/aparelho/:id', function ($id) use ($app) {
    require_once "classes/service/localizacaoService.php";

    $localizacaoService = new LocalizacaoService(null);

    try {
        echoResponse(200, $localizacaoService->recuperarLocalizacoesPorAparelho($id));
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }

});


$app->get($route.'/receber/:aparelho/wait/:wait', function ($aparelho,$wait) use ($app) {
    require_once "classes/service/localizacaoService.php";
    require_once "classes/helper/FcmHelper.php";

    $localizacaoService = new LocalizacaoService(null);
    try {
        $id = $localizacaoService->solicitarLocalizacao($aparelho,$wait);
        if(isset($id)){
            echoResponse(200, $localizacaoService->recuperar($id));
        } else{
            echoResponseClean(500, array("mensagens"=>"Não foi possível solicitar a localização."));
        }
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }
});


$app->get($route.'/:id', function ($id) use ($app) {
    require_once "classes/service/localizacaoService.php";

    $localizacaoService = new LocalizacaoService(null);
    try {
        echoResponse(200, $localizacaoService->recuperar($id));
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }
});

$app->delete($route.'/localizacao/:id', function ($id) use ($app) {
    require_once "classes/service/localizacaoService.php";

    $localizacaoService = new LocalizacaoService(null);
    try {
        echoResponseClean(200, $localizacaoService->deletar($id));
    }catch (Exception $exception){
        echoResponseClean(500, $exception->getMessage());
    }
});

?>