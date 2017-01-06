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
        $r = json_decode($app->request->getBody());
        require_once "classes/service/mensagemService.php";
        $mensagemService = new MensagemService(null);
        $mensagemService->atualizarRaw($r->id,$r->arquivo);

        echoResponseClean(200, true);
    } else {
        echoResponseClean(401, false);
    }
});


?>