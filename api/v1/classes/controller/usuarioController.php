<?php

$route="/usuario";

$app->post($route, function () use ($app) {
    $r = json_decode($app->request->getBody());

    if(isset($r)){
        require_once "classes/service/usuarioService.php";

        $usuarioService= new UsuarioService();
        try {
            $usuarioService . inserir($r);
            echoResponse(200,'true');
        }catch (Exception $exception){
            echoResponse(200,'false');
        }
    }
});


?>