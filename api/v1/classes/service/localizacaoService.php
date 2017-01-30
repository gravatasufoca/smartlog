<?php

require_once "classes/dao/dbHandler.php";

class LocalizacaoService
{
    private $db;
    private $carregados;


    private $queryAll = "select 
            localizacao.id,
            localizacao.dt_criacao data, 
            localizacao.vl_latitude latitude, 
            localizacao.vl_longitude longitude, 
            localizacao.vl_precisao precisao,
            case when localizacao.vl_latitude is not null and localizacao.vl_longitude is not null then 'true' else 'false' end carregado
        from tb_localizacoes localizacao ";


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
            return $this->db->executeQuery("delete from tb_localizacoes where id='$id' ");
        }
        return null;
    }

    public function recuperarPorAparelho($data,$idAparelho)
    {
        if (isset($data) && isset($idAparelho)) {
            try {
                return $this->db->getList($this->queryAll . " where DATE_FORMAT(localizacao.dt_criacao,'%d%m%Y')='$data' and id_aparelho=$idAparelho" . " order by localizacao.dt_criacao desc " . $this->limite);
            } catch (Exception $e) {
                throw new Exception($e);
            }
        }
        return null;
    }

    public function recuperarTopicosPorAparelho($idAparelho)
    {
        if (isset($idAparelho)) {
            try {
                return $this->db->getList("select
                                            DATE_FORMAT(localizacao.dt_criacao,'%d/%m/%Y') data,
                                            count(localizacao.id) qtd
                                        from tb_localizacoes localizacao
                                        where id_aparelho=$idAparelho
                                        GROUP BY DATE_FORMAT(localizacao.dt_criacao,'%d/%m/%Y') ");
            } catch (Exception $e) {
                throw new Exception($e);
            }
        }
        return null;
    }

    public function atualizarLocalizacao($id, $longitude,$latitude,$precisao)
    {
        if (isset($id) && isset($longitude) && isset($latitude)) {
            $this->db->atualizarLocalizacao($id,$longitude,$latitude,$precisao);
        }
    }

    public function solicitarLocalizacao($aparelho,$wait)
    {
        if (isset($aparelho)) {
            $id=$this->inserirSolicitacao($aparelho);
            $chave = getSession()["usuario"]["perfil"]["ds_chave"];
            if (isset($chave) && isset($id)) {
                require_once "classes/helper/FcmHelper.php";

                if (FcmHelper::sendMessage(array("chave" => $chave, "id" => $id, "duracao"=>$wait, "tipoAcao" => FcmHelper::$OBTER_LOCALIZACAO, "phpId" => session_id()), array($chave))) {
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
            $audio = $this->db->getOneRecord("select * from tb_localizacoes where id='$id' ");
            if (isset($audio)) {
                return $audio;
            }
        }
        return null;
    }

    private function inserirSolicitacao($idAparelho)
    {
        $tmp = array();
        $tmp["dt_criacao"] = $date = date('Y-m-d H:i:s');
        $tmp["id_aparelho"] = $idAparelho;

        $colunas = array("dt_criacao", "id_aparelho" );

        return $this->db->insertIntoTable($tmp, $colunas, "tb_localizacoes");

    }
}
?>