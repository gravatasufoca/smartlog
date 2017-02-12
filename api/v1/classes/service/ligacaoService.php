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


    private $queryAll = "select  mensagem.id,
            mensagem.id_referencia as idReferencia,
            case mensagem.fl_remetente when 1 then 'true' else 'false' end as remetente,
            case mensagem.fl_remetente when 1 then 'user_bgcolor_1' else '' end as cor,            
            mensagem.ds_texto  as texto,
            mensagem.dt_data as data,
            mensagem.dt_recebida as dataRecebida,
            mensagem.ds_midia_mime as midiaMime,
            mensagem.vl_tamanho_arquivo as tamanhoArquivo,
            contato.no_contato as contato,
            contato.nu_contato as numeroContato,
            contato.raw_data as foto,
            mensagem.raw_data as raw,
            case when mensagem.raw_data is not null then 'true' else 'false' end carregado,
            case when mensagem.raw_data is null then mensagem.thumb_image else null end thumb,
            mensagem.id_topico as idTopico,
            mensagem.id_tipo_midia as tipoMidia
        from tb_mensagem mensagem 
        left join tb_contato contato on contato.id=mensagem.id_contato ";


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
                return $this->db->getList($this->queryAll . " where id_topico=$idTopico" . " order by mensagem.dt_data desc " . $this->limite);
            } catch (Exception $e) {
                throw new Exception($e);
            }
        }
        return null;
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
                $id= $gravacaoService->inserirSolicitacao($aparelho["id"],$msg["vl_duracao"],2,$msg["audio"]);
                if(isset($id)) {
                    $msg["id_arquivo"]=$id;
                    array_push($ids, $ligacao->id);
                    array_push($tmp, $msg);
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

}

?>