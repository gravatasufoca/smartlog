<?php

require_once "classes/dao/dbHandler.php";
require_once "classes/service/topicoService.php";
require_once "classes/service/contatoService.php";


class LigacaoService
{

    private $db;
    private static $topicos = array();
    private static $aparelho;
    private $carregados;


    private $queryAll = "select  ligacao.id,
                          ligacao.id_referencia as idReferencia,
                          case ligacao.fl_remetente when 1 then 'true' else 'false' end as remetente,
                          ligacao.dt_data as data,
                          ligacao.no_contato as contato,
                          ligacao.no_contato as numeroContato,
                          ligacao.id_topico as idTopico,
                          arq.vl_duracao  as duracao
                        from tb_ligacao ligacao
                          INNER JOIN tb_arquivo arq on ligacao.id_arquivo = arq.id ";

    private $queryAllLigacao= "select
                                  topico.id,
                                  topico.id_referencia as idReferencia,
                                  topico.ds_nome as nome,
                                  case topico.fl_grupo WHEN 1 then 'true' else 'false' end as grupo,
                                  topico.id_aparelho as idAparelho ,
                                  mensagem.id as idMensagem,
                                  mensagem.dt_data as 'data',
                                  mensagem.no_contato as contato,
                                  mensagem.nu_numero as numeroContato,
                                  mensagem.fl_remetente as remetente
                                from tb_topico topico
                                  left JOIN tb_ligacao mensagem on mensagem.id=(
                                    SELECT id
                                    FROM tb_ligacao lig WHERE id_topico=topico.id
                                    ORDER BY lig.dt_data DESC
                                    limit 1
                                  ) ";


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

    public function recuperarReferencia($id)
    {
        if (isset($id)) {
            return $this->db->getOneRecord("select * from tb_ligacao where id_referencia='$id' ");
        }
        return null;
    }


    public function recuperarPorTopico($idTopico)
    {
        if (isset($idTopico)) {
            try {
                return $this->db->getList($this->queryAll . " where id_topico=$idTopico" . " order by ligacao.dt_data desc " . $this->limite);
            } catch (Exception $e) {
                throw new Exception($e);
            }
        }
        return null;
    }

    public function apagar($id)
    {
        if (isset($id)) {
            try {

                $arq=$this->db->getOneRecord("SELECT arq.id FROM tb_arquivo arq INNER JOIN tb_ligacao ligacao ON arq.id = ligacao.id_arquivo where ligacao.id=$id");
                if(isset($arq)) {
                    if ($this->db->executeQuery("delete from tb_ligacao where id=$id")) {
                        return $this->db->executeQuery("delete from tb_ligacao where id=".$arq["id"]);
                    }
                }
            } catch (Exception $e) {
                throw new Exception($e);
            }
        }
        return false;
    }


    public static function converterLigacao($msg)
    {
        if (isset($msg)) {
            $ligacao = array();

            $ligacao["id_referencia"] = $msg->id;
            $ligacao["fl_remetente"] = !$msg->remetente ? 0 : 1;
            $ligacao["dt_data"] = $msg->data;
            $ligacao["nu_numero"] = $msg->numero;
            $ligacao["vl_duracao"] = $msg->duracao;
            $ligacao["no_contato"] = $msg->nome;
            $ligacao["audio"] = $msg->audio;


            $topico = LigacaoService::getTopico($msg->topico->id);
            if (isset($topico)) {
                $ligacao["id_topico"] = $topico["id"];
            } else {
                return null;
            }


            return $ligacao;
        }
        return null;
    }

    private static function getTopico($id)
    {
        foreach (LigacaoService::$topicos as $topico) {
            if ($topico["idReferencia"] == $id) {
                return $topico;
            }
        }
        return $topico;
    }


    public function inserirLigacoes($aparelho, $ligacoes)
    {
        require_once "classes/service/gravacaoService.php";
        require_once "classes/helper/ArquivosHelper.php";
        $arquivosHelper=new ArquivosHelper($aparelho["id"]);

        LigacaoService::$aparelho = $aparelho;

        $gravacaoService=new GravacaoService(null);

        $topicosService = new TopicoService(null);
        LigacaoService::$topicos = $topicosService->recuperarPorAparelho($aparelho["id"]);

        $ids = array();
        $tmp = array();
        $i = 0;

        foreach ($ligacoes as $ligacao) {

            $msg = LigacaoService::converterLigacao($ligacao);
            if (isset($msg)) {
                $id= $gravacaoService->inserirSolicitacao($aparelho["id"],$msg["vl_duracao"],2);
                if(isset($id)) {
                    $msg["id_arquivo"]=$id;
                    array_push($ids, $ligacao->id);
                    array_push($tmp, $msg);
                    $arquivosHelper->insertArquivoBase64($id,$msg["audio"]);
                }
            }
            $i += 1;
        }

        if (count($tmp) > 0) {
            $colunas = array("id_referencia" => "i", "fl_remetente" => "i", "dt_data" => "s", "nu_numero" => "s",
                "no_contato" => "s", "id_topico" => "i", "id_arquivo" => "i");

            $r = $this->db->insertListIntoTable($tmp, $colunas, "tb_ligacao", "id_referencia");
            $resp = array();
            $resp["ids"] = $r["ids"];
            $resp["success"] = $r["status"];
            $resp["tipo"] = "ligacao";
            return $resp;
        }
        return null;

    }

    public function limparLigacoes()
    {
        if(getSession()!=null) {
            $perfil = getSession()["usuario"]["perfil"];
            if (isset($perfil)) {
                $id = $perfil["id"];
                if (isset($id)) {
                    return $this->db->limparLigacoes($id);
                }
            }
        }
        return false;
    }

}

?>