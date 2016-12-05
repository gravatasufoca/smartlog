<?php

$route="/usuario";

$app->post($route, function () use ($app) {
    $r = json_decode($app->request->getBody());

    if(isset($r)){
        require_once "classes/service/usuarioService.php";

        $usuarioService= new UsuarioService();
        try {
            $id=$usuarioService->inserir($r);
            if(!is_numeric($id)){
                echoResponse(401, $id);
            }else {
                $user = array();
                $user["id"] = $id;
                echoResponse(200, $user);
            }
        }catch (Exception $exception){
            echoResponse(500,$exception->getMessage());
        }
    }
});

$app->post($route."/perfil/:idPerfil/:chave", function ($idAparelho,$chave) use ($app) {

    if(isset($r)){
        require_once "classes/service/aparelhoService.php";

        $aparelhoService= new AparelhoService();
        try {
            $id=$aparelhoService->atualizarChave($idAparelho,$chave);
            if(!is_numeric($id)){
                echoResponse(401, $id);
            }else {
                $user = array();
                $user["id"] = $id;
                echoResponse(200, $user);
            }
        }catch (Exception $exception){
            echoResponse(500,$exception->getMessage());
        }
    }
});


?>