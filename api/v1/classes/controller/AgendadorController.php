<?php

$route="/agendador";

$app->get($route.'/observer', function () use ($app) {
    require_once "classes/service/agendadorService.php";

    $agendador=new AgendadorService();

    $agendador->enviarRequest();

    echoResponseClean(200,true);

});

?>