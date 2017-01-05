<?php

$route="/fcm";

$app->post($route.'/ativo', function ($id) use ($app) {
    require_once "classes/service/aparelhoService.php";
    unset($_SESSION["ativo"]);
    $aparelhoService= new AparelhoService();
    $aparelho=$aparelhoService->recuperar($id);
    if(isset($aparelho)){
        FcmHelper::sendMessage(array("tipoAcao"=>FcmHelper::$ESTA_ATIVO,"phpId"=>session_id()),array($aparelho["ds_chave"]));
        sleep(1);
        $tempo=0;
        while($tempo<10){
            if(isAtivo()){
                echoResponse(200, array("ativo"=>true));
                break;
            }
            $tempo+=2;
            sleep(2);
        }
        echoResponse(200, array("ativo"=>false));
    }
});


$app->post($route.'/estou-ativo', function ($id) use ($app) {
    $r = json_decode($app->request->getBody());
    session_start($r->phpId);
    $_SESSION["ativo"]=true;
});

?>