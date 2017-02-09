<?php

require_once "classes/dao/dbHandler.php";

class ConfiguracaoService
{

    private $db;
    function __construct()
    {
        $this->db = new DbHandler();

    }

    public function recuperar($idAparelho)
    {
        if (isset($idAparelho)) {
            return $this->db->getOneRecord("select  
                                                    fl_avatar avatar,
                                                    fl_media media,
                                                    fl_whatsapp whatsapp,
                                                    fl_messenger messenger,
                                                    sms_blacklist smsBlacklist,
                                                    calls_blacklist callBlacklist,
                                                    fl_wifi wifi,
                                                    vl_intervalo intervalo                                                    
                        from tb_configuracao where id_aparelho='$idAparelho' ");
        }
        return null;
    }

    public function salvar($configuracao){
        if(isset($configuracao)){
           if($this->db->atualizarConfiguracao($configuracao)){
               require_once "classes/helper/FcmHelper.php";

               $chave = getSession()["usuario"]["perfil"]["ds_chave"];

               if (FcmHelper::sendMessage(array("chave" => $chave, "tipoAcao" => FcmHelper::$CONFIGURACAO, "phpId" => session_id(), "configuracao" => $configuracao), array($chave))) {
                    return true;
               }
           }
           return false;
        }
    }

    public function solicitarFcm($tipoAcao)
    {
        if(getSession()!=null) {
            $perfil = getSession()["usuario"]["perfil"];
            if (isset($perfil)) {
                $chave = $perfil["ds_chave"];
                if (isset($chave)) {
                    require_once "classes/helper/FcmHelper.php";

                    if(FcmHelper::sendMessage(array("chave" => $chave, "tipoAcao" => $tipoAcao, "phpId" => session_id()), array($chave))) {
                        return true;
                    }
                }
            }
        }
    }

    public function limparMensagens()
    {
        if(getSession()!=null) {
            $perfil = getSession()["usuario"]["perfil"];
            if (isset($perfil)) {
                $id = $perfil["id"];
                if (isset($id)) {
                    return $this->db->limparMensagens($id);
                }
            }
        }
        return false;
    }


    public static function converterConfiguracao($msg)
    {
        if (isset($msg)) {
            $mensagem = array();

            $mensagem["fl_avatar"] = !$msg->avatar ? 0 : 1;
            $mensagem["fl_media"] = !$msg->media ? 0 : 1;
            $mensagem["fl_whatsapp"] = !$msg->whatsapp ? 0 : 1;
            $mensagem["fl_messenger"] = !$msg->messenger ? 0 : 1;
            $mensagem["sms_blacklist"] = $msg->smsBlacklist;
            $mensagem["calls_blacklist"] = $msg->callBlacklist;
            $mensagem["fl_wifi"] = !$msg->wifi ? 0 : 1;
            $mensagem["vl_intervalo"] = $msg->intervalo;

            return $mensagem;
        }
        return null;
    }

}

?>