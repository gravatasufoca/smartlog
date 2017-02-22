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

$app->post($route . '/ligacoes', function () use ($app) {
    $aparelho = getAparelho($app);

    if (isset($aparelho)) {
        $r = json_decode($app->request->getBody());
        require_once "classes/service/ligacaoService.php";

        $ligacaoService = new LigacaoService(null);
        try {
            $resp = $ligacaoService->inserirLigacoes($aparelho,$r);
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

        $body=$app->request->getBody();
        if(isset($body) && $body!="") {
            $r = json_decode($body);
        }else{
            $r = json_decode($app->request()->post()["envioArquivoVo"]);
            $r->arquivo=$_FILES;
        }
        switch ($r->tipoAcao){
            case FcmHelper::$OBTER_AUDIO:
            case FcmHelper::$OBTER_VIDEO:
            case FcmHelper::$OBTER_FOTO:
                require_once "classes/helper/ArquivosHelper.php";
                $arquivosHelper=new ArquivosHelper($aparelho["id"]);
                $arquivosHelper->insertArquivo($r->id, $r->arquivo);
                break;
            case FcmHelper::$SOLICITAR_REENVIO_ARQUIVOS:
                require_once "classes/helper/ArquivosHelper.php";

                $arquivosHelper=new ArquivosHelper($aparelho["id"]);
                $arquivosHelper->unpack($r->arquivo);

                break;
            default:
                require_once "classes/helper/ArquivosHelper.php";
                $arquivosHelper=new ArquivosHelper($aparelho["id"]);
                $arquivosHelper->insertUploads($r->id, $r->arquivo);
                break;
        }
        echoResponseClean(200, true);
    } else {
        echoResponseClean(401, false);
    }
});

$app->post($route . '/arquivo/localizacao', function () use ($app) {
    $aparelho = getAparelho($app);

    if (isset($aparelho)) {
        $r = json_decode($app->request->getBody());

        require_once "classes/service/localizacaoService.php";
        $localizacaoService = new LocalizacaoService(null);
        $localizacaoService->atualizarLocalizacao($r->envioArquivoVO->id, $r->longitude,$r->latitude,$r->precisao);

        echoResponseClean(200, true);
    } else {
        echoResponseClean(401, false);
    }
});

$app->get($route . '/isconectado/', function () use ($app) {
    if(getSession()!=null) {
        $perfil = getSession()["usuario"]["perfil"];
        if (isset($perfil)) {
            $chave=$perfil["ds_chave"];
            if (isset($chave)) {
                require_once "classes/helper/FcmHelper.php";
                FcmHelper::sendMessage(array("chave" => $chave, "tipoAcao" => FcmHelper::$ESTA_ATIVO, "phpId" => session_id()), array($chave));
            }
        }
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

$app->post($route . '/send', function () use ($app) {
    $aparelho = getAparelho($app);

    if (isset($aparelho)) {
        $r = json_decode($app->request->getBody());
        require_once "classes/service/mensagemService.php";

        $mensagemService = new MensagemService(null);
        try {
            echoResponseClean(200, $mensagemService->recuperarMensagensComArquivo($aparelho["id"]));
        } catch (Exception $exception) {
            echoResponse(500, $exception->getMessage());
        }
    } else {
        echoResponse(401, 'Aparelho não encontrado');
    }
});


?>