<?php

require '../libs/Slim/Slim.php';


\Slim\Slim::registerAutoloader();


$app = new \Slim\Slim();

if( ! ini_get('date.timezone') )
{
    date_default_timezone_set('GMT');
}

//destroySession();

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

function fixcharset($v){
    if(is_array($v)){
        $v=array_map('fixcharset',$v);
    }else {
        if(is_string($v)){
            return mb_convert_encoding($v, 'UTF-8', 'UTF-8');
        }
    }
    return $v;
}

function echoResponse($status_code, $response)
{
    $app = \Slim\Slim::getInstance();
    // Http response code
    $app->status($status_code);

    // setting response content type to json
    $app->contentType('application/json');
    $resultado = array();

    if (isset($response["status"]) && $response["status"] == "error") {
        $resultado["resultado"]=$response;
        echo json_encode($resultado);
        return;
    }

    $response=array_map('fixcharset',$response);

    $resultado["resultado"] = $response;
    $json = json_encode($resultado);
    if (!$json) {
        switch (json_last_error()) {
            case JSON_ERROR_NONE:
                $msg = ' - No errors';
                break;
            case JSON_ERROR_DEPTH:
                $msg = ' - Maximum stack depth exceeded';
                break;
            case JSON_ERROR_STATE_MISMATCH:
                $msg = ' - Underflow or the modes mismatch';
                break;
            case JSON_ERROR_CTRL_CHAR:
                $msg = ' - Unexpected control character found';
                break;
            case JSON_ERROR_SYNTAX:
                $msg = ' - Syntax error, malformed JSON';
                break;
            case JSON_ERROR_UTF8:
                $msg = ' - Malformed UTF-8 characters, possibly incorrectly encoded';
                break;
            default:
                $msg = ' - Unknown error';
                break;
        }
        $resultado = array();
        $app->status(500);
        $resultado["mensagens"] = $msg;
        echo json_encode($resultado);
    } else {
        echo $json;
    }
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


function isAtivo(){
    return isset(getSession()["ativo"]);
}

function inativar(){
    unset (getSession()["ativo"]);
}

function getSession()
{
    if (!isset($_SESSION)) {
        session_start();
    }
    return $_SESSION;
}

function getStaleSession($id)
{
    if (!isset($_SESSION)) {
        session_id($id);
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

function getTipoMensagen($tipo)
{
    switch (strtoupper($tipo)) {
        case "WHATSAPP":
            $idTipo = 0;
            break;
        case "SMS":
            $idTipo = 2;
            break;
        case "MESSENGER":
            $idTipo = 1;
            break;
        case "LIGACAO":
            $idTipo = 3;
            break;
        default :
            $idTipo = null;
            break;
    }

    return $idTipo;
}

function startsWith($haystack, $needle)
{
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
}

function endsWith($haystack, $needle)
{
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}

$app->run();
?>