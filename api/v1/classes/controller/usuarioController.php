<?php

//$route="/usuario";

$app->post('/usuario', function ($request, $response, $args) use ($app) {
    $r = json_decode($app->request->getBody());
});


?>