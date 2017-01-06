<?php

require_once "classes/dao/dbHandler.php";

class RequestService
{

    private $db;

    function __construct()
    {
        $this->db = new DbHandler();
    }

    public function recuperar($id,$phpId,$idAparelho){
        if(!isset($id) || !isset($phpId) || !isset($idAparelho)){
            return null;
        }
        $request = $this->db->getOneRecord("select * from tb_request where id='$id' and php_id='$phpId' and id_aparelho=$idAparelho");

        return $request;
    }

    public function inserir($id,$phpId,$idAparelho){
        if(isset($id) && isset($phpId) && isset($idAparelho)) {
            $colunas = array("id", "php_id","id_aparelho");
            $request = (object) array("id"=>$id, "php_id"=>$phpId,"id_aparelho"=>$idAparelho);

            $isUserExists = $this->recuperar($id,$phpId,$idAparelho);
            if(!$isUserExists) {
                return $this->db->insertIntoTable($request, $colunas, "tb_request");
            }else{
                return $isUserExists;
            }
        }
        return null;
    }

}

?>