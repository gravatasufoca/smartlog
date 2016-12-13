<?php

require_once "classes/dao/dbHandler.php";

class ContatoService
{

    private $db;

    private $queryAll="select id, no_contato,nu_contato from tb_contato ";

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

    public function recuperarPorNumero($idAparelho,$numero)
    {
        if (isset($id)) {
            return $this->db->getOneRecord($this->queryAll." where nu_contato='$numero' and id_aparelho=$idAparelho");
        }
        return null;
    }


    public function recuperarPorAparelho($idAparelho)
    {
        if(isset($idAparelho)) {
            try {
                return $this->db->getList($this->queryAll." where id_aparelho=$idAparelho ");
            }catch (Exception $e){
                throw new Exception($e);
            }
        }
        return null;
    }

    private function fixContato($contato){
        $cont=array();
        $cont["nu_contato"]=$contato->numero;
        $cont["no_contato"]=$contato->nome;
        $cont["id_aparelho"]=$contato->idAparelho;
        $cont["raw_data"]=isset($contato->foto)?$contato->foto:null;

        return $cont;
    }

    public function inserirContatos($aparelho,$contatos){
        $tmp=array();
        foreach ($contatos as $contato) {
            $contato->idAparelho = (int)$aparelho["id"];
            $co = $this->fixContato($contato);
            if (isset($co)) {
                array_push($tmp, $co);
            }
        }

        if(count($tmp)>0) {
            $r = $this->db->insertListIntoTable($tmp, array("nu_contato"=>'s', "no_contato"=>'s', "raw_data"=>'b', "id_aparelho"=>'i'), "tb_contato","nu_contato");
            $resp=array();
            $resp["ids"]=array();
            $resp["success"]=$r["status"];
            $resp["tipo"]="contato";
            return $resp;
        }
        return null;
    }
}

?>