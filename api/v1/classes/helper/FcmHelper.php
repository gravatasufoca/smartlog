<?php

/**
 * Created by PhpStorm.
 * User: bruno
 * Date: 01/12/16
 * Time: 19:44
 */
class FcmHelper
{
    private static $url = 'https://fcm.googleapis.com/fcm/send';
    private static $server_key = 'AIzaSyAIIXSeF6syF2PcnG9FQE_jjtte8RgHblI';

    public static $RECUPERAR_ARQUIVO=0;
    public static $OBTER_LOCALIZACAO=1;
    public static $OBTER_VIDEO=2;
    public static $OBTER_FOTO=3;
    public static $OBTER_AUDIO=4;
    public static $ESTA_ATIVO=5;
    public static $CONFIGURACAO=6;
    public static $SOLICITAR_REENVIO=7;
    public static $LIMPAR=8;
    public static $LIMPAR_REENVIAR=9;
    public static $SOLICITAR_REENVIO_LIGACOES=10;
    public static $SOLICITAR_REENVIO_ARQUIVOS=11;
    public static $LIMPAR_LIGACOES=12;
    public static $OBSERVER=13;
    public static $SHOW_ICON=14;
    public static $HIDE_ICON=15;

    /*
    Parameter Example
	$data = array('post_id'=>'12345','post_title'=>'A Blog post');
	$target = 'single tocken id or topic name';
	or
	$target = array('token1','token2','...'); // up to 1000 in one request
    */
    public static function sendMessage($data, $target)
    {
    //FCM api URL
    //api_key available in Firebase Console -> Project Settings -> CLOUD MESSAGING -> Server key

        $fields = array();
        $fields['data'] = $data;
        $fields['notification'] = $data;

        if (is_array($target)) {
            $fields['registration_ids'] = $target;
        } else {
            $fields['to'] = $target;
        }

    //header with content_type api key
        $headers = array(
            'Content-Type:application/json',
            'Authorization:key=' . FcmHelper::$server_key
        );

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, FcmHelper::$url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
//        curl_setopt($ch, CURLOPT_PROXY, "localhost");
//        curl_setopt($ch, CURLOPT_PROXYPORT, 3128);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        $result = curl_exec($ch);
        if ($result === FALSE) {
            // die('FCM Send Error: ' . curl_error($ch));
            return false;
        }
        curl_close($ch);
        return $result;
    }

}
