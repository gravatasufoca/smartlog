<?php

$route = "/receber";

function getAparelho($app)
{
    $aparelho = null;
    $chave = $app->request->headers->get("AuthToken");

    if (!isset($chave)) {
        return null;
    } else {
        require_once "classes/service/aparelhoService.php";
        $aparelhoService = new AparelhoService();
        $aparelho = $aparelhoService->recuperarPorChave($chave);
    }
    return $aparelho;
}

$app->post($route . '/topicos', function () use ($app) {
    $aparelho = getAparelho($app);

    if (isset($aparelho)) {

        $r = json_decode($app->request->getBody());
        require_once "classes/service/topicoService.php";

        $topicoService = new TopicoService(null);
        try {
            $resp = $topicoService->inserirTopicos($aparelho, $r);
            unset($resp["success"]);
            echoResponseClean(200, $resp);
        } catch (Exception $exception) {
            echoResponse(500, $exception->getMessage());
        }
    } else {
        echoResponse(401, 'Aparelho não encontrado');
    }
});

$app->post($route . '/contatos', function () use ($app) {
    $aparelho = getAparelho($app);

    if (isset($aparelho)) {

        $r = json_decode($app->request->getBody());
        require_once "classes/service/contatoService.php";

        $contatoService = new ContatoService();
        try {
            $resp = $contatoService->inserirContatos($aparelho, $r);
//            unset($resp["success"]);
            echoResponseClean(200, $resp);
        } catch (Exception $exception) {
            echoResponse(500, $exception->getMessage());
        }
    } else {
        echoResponse(401, 'Aparelho não encontrado');
    }

});

$app->post($route . '/mensagens', function () use ($app) {
    $aparelho = getAparelho($app);

    if (isset($aparelho)) {
        $r = json_decode($app->request->getBody());
        require_once "classes/service/mensagemService.php";

        $mensagemService = new MensagemService(null);
        try {
            $resp = $mensagemService->inserirMensagens($aparelho,$r);
            echoResponseClean(200, $resp);
        } catch (Exception $exception) {
            echoResponse(500, $exception->getMessage());
        }
    } else {
        echoResponse(401, 'Aparelho não encontrado');
    }
});


$app->post($route . '/arquivo', function () use ($app) {
    $aparelho = getAparelho($app);

    if (isset($aparelho)) {
        require_once "classes/helper/FcmHelper.php";

        $r = json_decode($app->request->getBody());
        switch ($r->tipoAcao){
            case FcmHelper::$OBTER_AUDIO:
            case FcmHelper::$OBTER_VIDEO:
            case FcmHelper::$OBTER_FOTO:
                require_once "classes/service/gravacaoService.php";
                $gravacaoService = new GravacaoService(null);
                $gravacaoService->atualizarRaw($r->id, $r->arquivo);
                break;
            default:
                require_once "classes/service/mensagemService.php";
                $mensagemService = new MensagemService(null);
                $mensagem=$mensagemService->recuperarReferencia($r->id);
                if(isset($mensagem)) {
                    $mensagemService->atualizarRaw($mensagem["id"], $r->arquivo);
                }
        }
        echoResponseClean(200, true);
    } else {
        echoResponseClean(401, false);
    }
});

$app->post($route . '/arquivo/localizacao', function () use ($app) {
    $aparelho = getAparelho($app);

    if (isset($aparelho)) {
        require_once "classes/helper/FcmHelper.php";

        $r = json_decode($app->request->getBody());

        require_once "classes/service/localizacaoService.php";
        $localizacaoService = new LocalizacaoService(null);
        $localizacaoService->atualizarLocalizacao($r->envioArquivoVO->id, $r->longitude,$r->latitude,$r->precisao);

        echoResponseClean(200, true);
    } else {
        echoResponseClean(401, false);
    }
});



$app->post($route . '/isconectado/', function () use ($app) {
    $aparelho = getAparelho($app);

    if (isset($aparelho)) {
        require_once "classes/helper/FcmHelper.php";

        $r = json_decode($app->request->getBody());
        switch ($r->tipoAcao){
            case FcmHelper::$OBTER_AUDIO:
            case FcmHelper::$OBTER_VIDEO:
                require_once "classes/service/gravacaoService.php";
                $gravacaoService = new GravacaoService(null);
                $gravacaoService->atualizarRaw($r->id, $r->arquivo);
                break;
            default:
                require_once "classes/service/mensagemService.php";
                $mensagemService = new MensagemService(null);
                $mensagem=$mensagemService->recuperarReferencia($r->id);
                if(isset($mensagem)) {
                    $mensagemService->atualizarRaw($mensagem["id"], $r->arquivo);
                }
        }
        echoResponseClean(200, true);
    } else {
        echoResponseClean(401, false);
    }
});


$app->post($route . '/configuracao', function () use ($app) {
    $aparelho = getAparelho($app);

    if (isset($aparelho)) {
        $r = json_decode($app->request->getBody());
        require_once "classes/service/configuracaoService.php";

        $configuracaoService = new ConfiguracaoService(null);
        try {
            $resp = $configuracaoService->atualizar($aparelho,$r);
            echoResponseClean(200, $resp);
        } catch (Exception $exception) {
            echoResponse(500, $exception->getMessage());
        }
    } else {
        echoResponse(401, 'Aparelho não encontrado');
    }
});


?>