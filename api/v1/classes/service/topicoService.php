<?php

require_once "classes/dao/dbHandler.php";

class TopicoService
{

    private $db;

    private $queryAll="select id, id_referencia as idReferencia, ds_nome as nome, case fl_grupo WHEN 1 then 'true' else 'false' end as grupo, id_aparelho as idAparelho from tb_topico";

    function __construct()
    {
        $this->db = new DbHandler();
    }

    public function recuperar($id)
    {
        if (isset($id)) {
           return $this->db->getOneRecord($this->queryAll." where id='$id' ");
                    }
        return null;
    }



    public function recuperarPorAparelho($idAparelho)
    {
        if(isset($idAparelho)) {
            try {
                return $this->db->getList($this->queryAll . " where id_aparelho=$idAparelho");
            }catch (Exception $e){
                throw new Exception($e);
            }
        }
        return null;
    }
}

?>