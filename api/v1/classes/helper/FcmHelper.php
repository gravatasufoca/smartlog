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
    private static $server_key = 'AIzaSyBk6RPeEzlZ4nQF2Op882zAG2tx5YbWMnU';


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
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        $result = curl_exec($ch);
        if ($result === FALSE) {
            die('FCM Send Error: ' . curl_error($ch));
        }
        curl_close($ch);
        return $result;
    }

}
