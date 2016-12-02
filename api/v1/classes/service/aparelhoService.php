<?php

require_once "classes/dao/dbHandler.php";

class AparelhoService
{

    private $db;

    function __construct()
    {
        $this->db = new DbHandler();
    }

    public function inserir($perfil){
        if(isset($perfil)  && isset($perfil["ds_chave"]) && isset($perfil["no_aparelho"]) && isset($perfil["id_usuario"])) {
            $colunas = array("ds_chave", "no_aparelho","id_usuario");

            $chave = $perfil["ds_chave"];

            $isUserExists = $this->db->getOneRecord("select id from tb_aparelho where fl_ativo=1 and ds_chave='$chave'");
            if(!$isUserExists) {
                return $this->db->insertIntoTable($perfil, $colunas, "tb_aparelho");
            }else{
                return $isUserExists;
            }
        }
        return null;
    }
}

?>