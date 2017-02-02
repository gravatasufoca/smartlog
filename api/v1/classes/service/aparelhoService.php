<?php

require_once "classes/dao/dbHandler.php";

class AparelhoService
{

    private $db;

    function __construct()
    {
        $this->db = new DbHandler();
    }

    public function recuperar($id){
        if(!isset($id)){
            return null;
        }
        $aparelho = $this->db->getOneRecord("select * from tb_aparelho where fl_ativo=1 and id='$id'");

        return $aparelho;
    }

    public function inserir($perfil){
        if(isset($perfil->ds_chave) && isset($perfil->no_aparelho) && isset($perfil->id_usuario)) {
            $colunas = array("ds_chave", "no_aparelho","id_usuario");

            $chave = $perfil->ds_chave;

            $isPerfilExiste = $this->recuperarPorChave($chave);
            if(!$isPerfilExiste) {
                $isPerfilExiste= $this->db->insertIntoTable($perfil, $colunas, "tb_aparelho");

                $this->db->insertIntoTable((object)array("id_aparelho"=>$isPerfilExiste), array("id_aparelho"), "tb_configuracao");

            }else{
                $this->atualizarChave($isPerfilExiste["id"],$perfil->ds_chave);
            }
            return $isPerfilExiste;
        }
        return null;
    }

    public function atualizarChave($idAparelho, $chave){
        if(isset($idAparelho) && isset($chave)){
            $query="update tb_aparelho set ds_chave='$chave' where id=$idAparelho";

           return $this->db->executeQuery($query);
        }
    }

    public function recuperarPorChave($chave){
        if(!isset($chave)){
            return null;
        }
        $aparelho = $this->db->getOneRecord("select * from tb_aparelho where fl_ativo=1 and ds_chave='$chave'");

        return $aparelho;
    }
}

?>