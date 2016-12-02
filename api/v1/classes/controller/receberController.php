<?php

$route="/receber";

$app->post($route.'/topicos', function () use ($app) {
    $r = json_decode($app->request->getBody());
    echo "true";
});


?>