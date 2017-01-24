<?php

require_once "classes/dao/dbHandler.php";

class GravacaoService
{

    private $db;
    private $carregados;


    private $queryAll = "select 
            gravacao.id,
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

    public function deletar($id)
    {
        if (isset($id)) {
            return $this->db->executeQuery("delete from tb_gravacao where id='$id' ");
        }
        return null;
    }

    public function recuperarPorAparelho($data,$idAparelho,$tipo)
    {
        if (isset($data) && isset($idAparelho) && isset($tipo)) {
            try {
                return $this->db->getList($this->queryAll . " where DATE_FORMAT(gravacao.dt_criacao,'%d%m%Y')='$data' and fl_video=$tipo and id_aparelho=$idAparelho" . " order by gravacao.dt_criacao desc " . $this->limite);
            } catch (Exception $e) {
                throw new Exception($e);
            }
        }
        return null;
    }

    public function recuperarTopicosPorAparelho($idAparelho,$tipo)
    {
        if (isset($idAparelho) && isset($tipo)) {
            try {
                return $this->db->getList("select
                                            DATE_FORMAT(gravacao.dt_criacao,'%d/%m/%Y') data,
                                            count(gravacao.id) qtd
                                        from tb_gravacao gravacao
                                        where fl_video=$tipo and id_aparelho=$idAparelho
                                        GROUP BY DATE_FORMAT(gravacao.dt_criacao,'%d/%m/%Y') 
                                        order by gravacao.dt_criacao desc ");
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
            $id=$this->inserirSolicitacao($aparelho,$duracao,$tipo);
            $chave = getSession()["usuario"]["perfil"]["ds_chave"];
            if (isset($chave) && isset($id)) {
                require_once "classes/helper/FcmHelper.php";

                if (FcmHelper::sendMessage(array("chave" => $chave, "id" => $id, "tipoAcao" => $tipo, "phpId" => session_id(), "duracao" => $duracao), array($chave))) {
                    return $id;
                }else{
                    $this->deletar($id);
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

    private function inserirSolicitacao($idAparelho, $duracao,$tipo)
    {

        $tmp = array();
        $tmp["dt_criacao"] = $date = date('Y-m-d H:i:s');
        $tmp["vl_duracao"] = $duracao;
        $tmp["id_aparelho"] = $idAparelho;
        $tmp["fl_video"] = $tipo=="3" || $tipo==3?"1":"0";
        $tmp["raw_data"] = null;

        $colunas = array("dt_criacao", "vl_duracao", "fl_video", "id_aparelho" , "raw_data");

        return $this->db->insertIntoTable($tmp, $colunas, "tb_gravacao");

    }
}
?>