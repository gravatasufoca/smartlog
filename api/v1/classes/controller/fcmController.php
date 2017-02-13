<?php

$route="/fcm";

$app->get($route.'/ativo/:inativa', function ($inativa) use ($app) {
    require_once "classes/service/aparelhoService.php";
    if(getSession()!=null) {
        $perfil = getSession()["usuario"]["perfil"];
        if($inativa=="true") {
            $perfil["conectado"]=false;
            if (isset($perfil)) {
                $chave = $perfil["ds_chave"];
                if (isset($chave)) {
                    require_once "classes/helper/FcmHelper.php";
                    if(FcmHelper::sendMessage(array("chave" => $chave, "tipoAcao" => FcmHelper::$ESTA_ATIVO, "phpId" => session_id()), array($chave))){
                        echoResponseClean(200,true);
                        return;
                    }
                }
            }
            echoResponseClean(200, false);
            return;
        }else{
            echoResponseClean(200, $perfil["conectado"]);
            return;
        }
    }
    echoResponseClean(200,getSession(), false);

});


$app->post($route.'/conectado', function () use ($app) {
    $r = json_decode($app->request->getBody());
    getStaleSession($r->phpId);
    if(isset($_SESSION)) {
        $_SESSION["usuario"]["perfil"]["conectado"]=true;
        session_commit();
    }
});

?>