<?php

require '../libs/Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

destroySession();

foreach (glob("classes/controller/*.php") as $filename) {
    require_once $filename;
}

/**
 * Verifying required params posted or not
 */
function verifyRequiredParams($required_fields, $request_params)
{
    $error = false;
    $error_fields = "";
    foreach ($required_fields as $field) {
        if (!isset($request_params->$field) || strlen(trim($request_params->$field)) <= 0) {
            $error = true;
            $error_fields .= $field . ', ';
        }
    }

    if ($error) {
        // Required field(s) are missing or empty
        // echo error json and stop the app
        $response = array();
        $app = \Slim\Slim::getInstance();
        $response["status"] = "error";
        $response["message"] = 'Required field(s) ' . substr($error_fields, 0, -2) . ' is missing or empty';
        echoResponse(200, $response);
        $app->stop();
    }
}


function echoResponse($status_code, $response)
{
    $app = \Slim\Slim::getInstance();
    // Http response code
    $app->status($status_code);

    // setting response content type to json
    $app->contentType('application/json');
    $resultado=array();
    $resultado["resultado"]=$response;
    echo json_encode($resultado);
}

function echoResponseClean($status_code, $response)
{
    $app = \Slim\Slim::getInstance();
    // Http response code
    $app->status($status_code);

    // setting response content type to json
    $app->contentType('application/json');
    echo json_encode($response);
}

function getSession()
{
    if (!isset($_SESSION)) {
        session_start();
    }
   return $_SESSION;
}

function destroySession()
{
    if (!isset($_SESSION)) {
        session_start();
    }
    if (isSet($_SESSION['usuario'])) {
        unset($_SESSION['usuario']);
        $info = 'info';
        if (isSet($_COOKIE[$info])) {
            setcookie($info, '', time() - $cookie_time);
        }
        $msg = "Logged Out Successfully...";
    } else {
        $msg = "Not logged in...";
    }
    return $msg;
}

function getTipoMensagen($tipo){
    switch (strtoupper($tipo)){
        case "WHATSAPP":
            $idTipo=0;
            break;
        case "SMS":
            $idTipo=2;
            break;
        case "MESSENGER":
            $idTipo=1;
            break;
        default :
            $idTipo=null;
            break;
    }

    return $idTipo;
}

$app->run();
?>