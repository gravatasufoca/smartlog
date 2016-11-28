<?php
$app->get('/session', function () {
    $db = new DbHandler();
    $session = $db->getSession();
    $response["id"] = $session['id'];
    $response["email"] = $session['email'];
    echoResponse(200, $session);
});

$app->post('/login', function () use ($app) {
    require_once 'passwordHash.php';
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('username', 'password'), $r);
    $response = array();
    $db = new DbHandler();
    $password = $r->password;
    $email = $r->username;
    $user = $db->getOneRecord("select id,ds_email,ds_senha from tb_usuario where ds_email='$email' ");
    if ($user != NULL) {
//        if (passwordHash::check_password($user['ds_email'], $password)) {
        if($user['ds_senha']== $password){
            $response['status'] = "success";
            $response['message'] = 'Logged in successfully.';
            $id=$user['id'];
            $perfis= $db->getList("select no_aparelho as nome, id from tb_aparelho where id_usuario=$id");
            $user['perfis']=$perfis;

            $roles= array();
            $roles[0]=("ROLE_LOGADO");
            $user['roles']=$roles;

            if(count($perfis)==1){
                $user['perfil']=$perfis[0];
            }

            $response['usuario'] = $user;
            if (!isset($_SESSION)) {
                session_start();
            }

            $_SESSION['id'] = $user['id'];
            $_SESSION['email'] = $email;
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

$app->post('/login/usuario', function () use ($app) {
    $r = json_decode($app->request->getBody());
});


$app->post('/signUp', function () use ($app) {
    $response = array();
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('ds_email', 'ds_senha'), $r->customer);
    require_once 'passwordHash.php';
    $db = new DbHandler();
    $email = $r->customer->email;
    $address = $r->customer->address;
    $password = $r->customer->password;
    $isUserExists = $db->getOneRecord("select 1 from customers_auth where phone='$phone' or email='$email'");
    if (!$isUserExists) {
        $r->customer->password = passwordHash::hash($password);
        $tabble_name = "customers_auth";
        $column_names = array('phone', 'name', 'email', 'password', 'city', 'address');
        $result = $db->insertIntoTable($r->customer, $column_names, $tabble_name);
        if ($result != NULL) {
            $response["status"] = "success";
            $response["message"] = "User account created successfully";
            $response["uid"] = $result;
            if (!isset($_SESSION)) {
                session_start();
            }
            $_SESSION['uid'] = $response["uid"];
            $_SESSION['phone'] = $phone;
            $_SESSION['name'] = $name;
            $_SESSION['email'] = $email;
            echoResponse(200, $response);
        } else {
            $response["status"] = "error";
            $response["message"] = "Failed to create customer. Please try again";
            echoResponse(201, $response);
        }
    } else {
        $response["status"] = "error";
        $response["message"] = "An user with the provided phone or email exists!";
        echoResponse(201, $response);
    }
});
$app->get('/logout', function () {
    $db = new DbHandler();
    $session = $db->destroySession();
    $response["status"] = "info";
    $response["message"] = "Logged out successfully";
    echoResponse(200, $response);
});
?>