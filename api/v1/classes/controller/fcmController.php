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
            echoResponse(200, array("ativo"=>false,"wifi"=>false));
            return;
        }else{
            echoResponse(200, array("ativo"=>$perfil["conectado"],"wifi"=>$perfil["wifi"]));
            return;
        }
    }
    echoResponseClean(200,getSession(), false);

});


$app->post($route.'/conectado', function () use ($app) {
    debug("hahahhaha");
    $r = json_decode($app->request->getBody());
    debug($r);
    getStaleSession($r->phpId);
    if(isset($_SESSION)) {
        $_SESSION["usuario"]["perfil"]["conectado"]=true;
        $_SESSION["usuario"]["perfil"]["wifi"]=$r->wifi;
        session_commit();
    }
});

?>