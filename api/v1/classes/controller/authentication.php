<?php

$app->post('/login', function () use ($app) {
    require_once 'classes/utils/passwordHash.php';
    require_once 'classes/service/usuarioService.php';

    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('username', 'password'), $r);
    $response = array();
    $password = $r->password;
    $email = $r->username;

    $usuarioService = new usuarioService();

    $user=$usuarioService->recuperarPorEmail($email,null);

    if ($user != NULL) {
//        if (passwordHash::check_password($user['ds_email'], $password)) {
        if($user['ds_senha']== $password){
            $response['status'] = "success";
            $response['message'] = 'Logged in successfully.';

            $response['usuario'] = $user;
            if (!isset($_SESSION)) {
                session_start();
            }
            $_SESSION['usuario'] = $user;
            $response['access_token'] = session_id();

        } else {
            $response['status'] = "error";
            $response['message'] = 'Login failed. Incorrect credentials';
        }
    } else {
        $response['status'] = "error";
        $response['message'] = 'No such user is registered';
    }
    echoResponse(200, $response);
});

$app->get('/login/usuario', function () use ($app) {
    getSession();
    $user=$_SESSION["usuario"];
    if(isset($user)){
        $response = array();
        $response['usuario'] = $user;
        echoResponse(200, $response);
    };
});

$app->post('/login/perfil', function () use ($app) {
    getSession();
    $user=$_SESSION["usuario"];
    if(isset($user)){
        $r = json_decode($app->request->getBody());

        foreach ($user['perfis'] as $perfil){
            if($perfil['id']==$r->id){
                $user['perfil']=$perfil;
            }
        }
        $_SESSION["usuario"]=$user;
        $response = array();
        $response['usuario'] = $user;
        echoResponse(200, $response);
    }
});


$app->post('/logout', function () {

    destroySession();
    $response["status"] = "info";
    $response["message"] = "Logged out successfully";
    echoResponse(200, $response);
});
?>