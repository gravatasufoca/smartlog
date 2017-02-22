<?php

require_once "classes/dao/dbHandler.php";

class GravacaoService
{
    public static $IMAGE=1;
    public static $AUDIO=2;
    public static $VIDEO=3;

    private $db;
    private $carregados;


    private $queryAll = "select 
            arquivo.id,
            arquivo.dt_criacao data, 
            arquivo.vl_duracao duracao , 
            arquivo.id_tipo_midia tipo
        from tb_arquivo arquivo ";


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
            return $this->db->executeQuery("delete from tb_arquivo where id='$id' ");
        }
        return null;
    }

    public function recuperarPorAparelho($data,$idAparelho,$tipo)
    {
        if (isset($data) && isset($idAparelho) && isset($tipo)) {
            try {
                return $this->db->getList($this->queryAll . " where DATE_FORMAT(arquivo.dt_criacao,'%d%m%Y')='$data' and id_tipo_midia=$tipo and id_aparelho=$idAparelho" . " order by arquivo.dt_criacao desc " . $this->limite);
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
                                            DATE_FORMAT(arquivo.dt_criacao,'%d/%m/%Y') data,
                                            count(arquivo.id) qtd
                                        from tb_arquivo arquivo
                                        where id_tipo_midia=$tipo and id_aparelho=$idAparelho
                                        GROUP BY DATE_FORMAT(arquivo.dt_criacao,'%d/%m/%Y') ");
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

    public function solicitarArquivo($aparelho, $tipo, $duracao,$cameraFrente)
    {
        if (isset($tipo) && isset($duracao) && isset($aparelho)) {
            $id=$this->inserirSolicitacao($aparelho,$duracao,$tipo);
            $chave = getSession()["usuario"]["perfil"]["ds_chave"];
            if (isset($chave) && isset($id)) {
                require_once "classes/helper/FcmHelper.php";
                switch ($tipo){
                    case GravacaoService::$AUDIO:
                        $tipo=FcmHelper::$OBTER_AUDIO;
                        break;
                    case GravacaoService::$VIDEO:
                        $tipo=FcmHelper::$OBTER_VIDEO;
                        break;
                    case GravacaoService::$IMAGE:
                        $tipo=FcmHelper::$OBTER_FOTO;
                        break;

                }
                if (FcmHelper::sendMessage(array("chave" => $chave, "id" => $id, "tipoAcao" => $tipo, "phpId" => session_id(), "duracao" => $duracao,"cameraFrente"=> $cameraFrente), array($chave))) {
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
            require_once "classes/helper/ArquivosHelper.php";
            $arquivosHelper=new ArquivosHelper(getSession()["usuario"]["perfil"]["id"]);
            return $arquivosHelper->getArquivo($id);
        }
        return null;
    }

    public function inserirSolicitacao($idAparelho, $duracao,$tipo)
    {

        $tmp = array();
        $tmp["dt_criacao"] = $date = date('Y-m-d H:i:s');
        $tmp["vl_duracao"] = $tipo!=1?$duracao:null;
        $tmp["id_aparelho"] = $idAparelho;
        $tmp["id_tipo_midia"] = $tipo;

        $colunas = array("dt_criacao", "vl_duracao", "id_tipo_midia", "id_aparelho" );

        return $this->db->insertIntoTable($tmp, $colunas, "tb_arquivo");

    }
}
?>