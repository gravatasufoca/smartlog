<?php

require_once "classes/dao/dbHandler.php";

class AgendadorService
{

    private $db;

    function __construct()
    {
        $this->db = new DbHandler();
    }

    public function enviarRequest()
    {
        require_once "classes/helper/FcmHelper.php";
        $resp = $this->db->getList("SELECT ds_chave FROM tb_aparelho WHERE fl_ativo=1");
        $chaves = array();
        foreach ($resp as $chave) {
            array_push($chaves, array_pop($resp)["ds_chave"]);
            if (count($chaves) == 999 or count($resp) == 0) {
                FcmHelper::sendMessage(array("tipoAcao" => FcmHelper::$OBSERVER), $chaves);
                $chaves = array();
            }
        }
    }
}

?>