<?php

require_once "classes/dao/dbHandler.php";
require_once "classes/service/topicoService.php";
require_once "classes/service/contatoService.php";


class MensagemService
{

    private $db;
    private static $topicos = array();
    private static $contatos = array();
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
            case mensagem.carregado when 1 then 'true' else 'false' end as carregado,
            mensagem.thumb_image thumb,
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
            return $this->db->getOneRecord("select * from tb_mensagem where id_referencia='$id' ");
        }
        return null;
    }

    public function atualizarRaw($id,$raw){
        if(isset($id) && isset($raw)){
            $this->db->atualizaRawMensagem($raw,$id);
        }
    }


    public function solicitarArquivo($id)
    {
        if (isset($id)) {
            $mensagem = $this->db->getOneRecord("select id_referencia from tb_mensagem where id='$id' ");
            if (isset($mensagem)) {
                $chave = getSession()["usuario"]["perfil"]["ds_chave"];
                if (isset($chave)) {
                    require_once "classes/helper/FcmHelper.php";

                    if(FcmHelper::sendMessage(array("chave" => $chave, "id" => $id, "tipoAcao" => FcmHelper::$RECUPERAR_ARQUIVO, "phpId" => session_id()), array($chave))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public function recuperarArquivo($id)
    {
        if (isset($id)) {
            $mensagem = $this->db->getOneRecord("select raw_data from tb_mensagem where id='$id' ");
            if (isset($mensagem)) {
                return $mensagem;
            }
        }
        return null;
    }
    public function recuperarArquivoPorReferencia($id)
    {
        if (isset($id)) {

            require_once "classes/helper/ArquivosHelper.php";

            $arquivosHelper=new ArquivosHelper(getSession()["usuario"]["perfil"]["id"]);

            $file=$arquivosHelper->getUpload($id);
            if(isset($file["file"])){
                $this->atualizarCarregados(array($id));
            }
            return $file;

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

    public function recuperarMensagensComArquivo($idAparelho)
    {
        if (isset($idAparelho)) {
            try {
                $mensagens= $this->db->getList("SELECT mensagem.id_referencia
                                                    FROM tb_mensagem mensagem
                                                      INNER JOIN tb_topico topico on mensagem.id_topico = topico.id
                                                    where topico.id_aparelho=$idAparelho
                                                      and mensagem.carregado=1");

                $tmp=array();
                foreach ($mensagens as $id){
                    array_push($tmp,$id["id_referencia"]);
                }
                return $tmp;
            } catch (Exception $e) {
                throw new Exception($e);
            }
        }
        return null;
    }

    public function atualizarCarregados($ids){
        if(isset($ids)) {
            $ids = join(",", $ids);
            $this->db->executeQuery("update tb_mensagem set carregado=1 where id_referencia in($ids)");
        }
    }

    public static function getMensagem($id, $idReferencia, $remetente, $texto, $data, $dataRecebida, $midiaMime, $tamanhoArquivo, $contato, $numeroContato, $foto, $raw, $thumb, $topico, $tipoMidia)
    {
        $mensagem = array();

        $mensagem["id"] = $id;
        $mensagem["idReferencia"] = $idReferencia;
        $mensagem["remetente"] = $remetente;
        $mensagem["texto"] = isset($texto) ? converterString($texto) : null;
        $mensagem["data"] = $data;
        $mensagem["dataRecebida"] = $dataRecebida;
        $mensagem["midiaMime"] = $midiaMime;
        $mensagem["tamanhoArquivo"] = $tamanhoArquivo;
        $mensagem["contato"] = $contato;
        $mensagem["numeroContato"] = $numeroContato;
        $mensagem["foto"] = isset($foto) ? base64_encode($foto) : null;
        $mensagem["raw"] = isset($raw) ? base64_encode($raw) : null;
        $mensagem["thumb"] = isset($thumb) ? base64_encode($thumb) : null;
        $mensagem["idTopico"] = $topico;
        $mensagem["tipoMidia"] = $tipoMidia;

        return $mensagem;
    }

    public static function converterMensagem($msg)
    {
        if (isset($msg)) {
            $mensagem = array();

            $mensagem["id_referencia"] = $msg->id;
            $mensagem["fl_remetente"] = !$msg->remetente ? 0 : 1;
            $mensagem["ds_texto"] = isset($msg->texto) ? $msg->texto : null;
            $mensagem["dt_data"] = $msg->data;
            $mensagem["dt_recebida"] = $msg->dataRecebida;
            $mensagem["ds_midia_mime"] = isset($msg->midiaMime) ? $msg->midiaMime : null;
            $mensagem["vl_tamanho_arquivo"] = $msg->tamanhoArquivo;
            $mensagem["thumb_image"] = isset($msg->raw_data) ? $msg->raw_data : null;
            $mensagem["id_tipo_midia"] = $msg->tipoMidia;

            $topico = MensagemService::getTopico($msg->topico->id);
            if (isset($topico)) {
                $mensagem["id_topico"] = $topico["id"];
            } else {
                return null;
            }

            if (!$msg->remetente && isset($msg->numeroContato) && $msg->numeroContato != "") {
                $contato = MensagemService::getContato($msg->numeroContato);
                if (isset($contato)) {
                    $mensagem["id_contato"] = $contato["id"];
                } else {
                    $contatoService = new ContatoService();

                    $num = $msg->numeroContato;
                    if (strpos($num, "-")) {
                        $num = substr($num, 0, strpos($num, "-"));
                    }

                    $num = $contatoService->inserir(MensagemService::$aparelho["id"], $num, $num);

                    $contatoService = new ContatoService();
                    MensagemService::$contatos = $contatoService->recuperarPorAparelho(MensagemService::$aparelho["id"]);

                    if (isset($num)) {
                        $mensagem["id_contato"] = $num;
                    } else {
                        return null;
                    }

                }
            } else {
                $mensagem["id_contato"] = 1;
            }

            return $mensagem;
        }
        return null;
    }

    private static function getTopico($id)
    {
        foreach (MensagemService::$topicos as $topico) {
            if ($topico["idReferencia"] == $id) {
                return $topico;
            }
        }
        return $topico;
    }

    private static function getContato($numero)
    {
        foreach (MensagemService::$contatos as $contato) {
            if (!isset($contato["nu_contato"]) || $contato["nu_contato"] == "") {
                continue;
            }
            $num = $numero;
            if (strpos($numero, "-")) {
                $num = substr($numero, 0, strpos($numero, "-"));
            }

            if ($contato["nu_contato"] == $num) {
                return $contato;
            } else {
                if (endsWith($num, substr($contato["nu_contato"], -8))) {
                    return $contato;
                }
            }
        }
        return null;
    }

    public function inserirMensagens($aparelho, $mensagens)
    {
        MensagemService::$aparelho = $aparelho;

        $topicosService = new TopicoService(null);
        MensagemService::$topicos = $topicosService->recuperarPorAparelho($aparelho["id"]);
        $contatoService = new ContatoService();
        MensagemService::$contatos = $contatoService->recuperarPorAparelho($aparelho["id"]);

        $ids = array();
        $tmp = array();
        $i = 0;

        foreach ($mensagens as $mensagem) {
            //echo $i+"</br>";
            $msg = MensagemService::converterMensagem($mensagem);
            if (isset($msg)) {
                array_push($ids, $mensagem->id);
                array_push($tmp, $msg);
            }
            $i += 1;
        }

        if (count($tmp) > 0) {
            $colunas = array("id_referencia" => "i", "fl_remetente" => "i", "ds_texto" => "s", "dt_data" => "s", "dt_recebida" => "s", "ds_midia_mime" => "s",  "thumb_image" => "s",
                "vl_tamanho_arquivo" => "i", "id_tipo_midia" => "i", "id_topico" => "i", "id_contato" => "i");

            $r = $this->db->insertListIntoTable($tmp, $colunas, "tb_mensagem", "id_referencia");
            $resp = array();
            $resp["ids"] = $r["ids"];
            $resp["success"] = $r["status"];
            $resp["tipo"] = "mensagem";
            return $resp;
        }
        return null;

    }

}

?>