<?php

require_once "classes/dao/dbHandler.php";

class GravacaoService
{

    private $db;
    private $carregados;


    private $queryAll = "select 
            gravacao.dt_criacao data, 
            gravacao.vl_duracao duracao , 
            gravacao.raw_data raw, 
            gravacao.fl_video video,
            case when gravacao.raw_data is not null then 'true' else 'false' end carregado
        from tb_gravacao gravacao ";


    function __construct($carregados)
    {
        $this->db = new DbHandler();
        $this->carregados = $carregados;
        if ($carregados == 0) {
            $this->limite = " limit 15";
        } else {
            $this->limite = " limit " . $this->carregados . ",15";
        }
    }

    public function recuperar($id)
    {
        if (isset($id)) {
            return $this->db->getOneRecord($this->queryAll . " where id='$id' ");
        }
        return null;
    }

    public function recuperarPorAparelho($idAparelho)
    {
        if (isset($idAparelho)) {
            try {
                return $this->db->getList($this->queryAll . " where id_aparelho=$idAparelho" . " order by gravacao.dt_criacao desc " . $this->limite);
            } catch (Exception $e) {
                throw new Exception($e);
            }
        }
        return null;
    }

    public function atualizarRaw($id, $raw)
    {
        if (isset($id) && isset($raw)) {
            $this->db->atualizaRawGravacao($raw, $id);
        }
    }

    public function solicitarArquivo($aparelho, $tipo, $duracao)
    {
        if (isset($tipo) && isset($duracao) && isset($aparelho)) {
            $id=$this->inserirSolicitacao($aparelho,$duracao);
            $chave = getSession()["usuario"]["perfil"]["ds_chave"];
            if (isset($chave) && isset($id)) {
                require_once "classes/helper/FcmHelper.php";

                if (FcmHelper::sendMessage(array("chave" => $chave, "id" => $id, "tipoAcao" => $tipo, "phpId" => session_id(), "duracao" => $duracao), array($chave))) {
                    return $id;
                }
            }
        }
        return null;
    }

    public function recuperarArquivo($id)
    {
        if (isset($id)) {
            $audio = $this->db->getOneRecord("select raw_data from tb_gravacao where id='$id' ");
            if (isset($audio)) {
                return $audio;
            }
        }
        return null;
    }

    private function inserirSolicitacao($idAparelho, $duracao)
    {

        $tmp = array();
        $tmp["dt_criacao"] = new DateTime();
        $tmp["vl_duracao"] = $duracao;
        $tmp["id_aparelho"] = $idAparelho;
        $tmp["fL_video"] = 0;
        $tmp["raw_data"] = "";

        $colunas = array("dt_criacao", "vl_duracao", "fl_video", "id_aparelho" , "raw_data");

        return $this->db->insertIntoTable($tmp, $colunas, "tb_gravacao");

    }
}
?>