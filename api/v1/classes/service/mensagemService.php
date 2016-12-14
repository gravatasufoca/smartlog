<?php

require_once "classes/dao/dbHandler.php";
require_once "classes/service/topicoService.php";
require_once "classes/service/contatoService.php";

class MensagemService
{

    private $db;
    private static $topicos=array();
    private static $contatos=array();

    private $queryAll="select  mensagem.id,
            mensagem.id_referencia as idReferencia,
            case mensagem.fl_remetente when 1 then 'true' else 'false' end as remetente,
            mensagem.ds_texto  as texto,
            mensagem.dt_data as data,
            mensagem.dt_recebida as dataRecebida,
            mensagem.ds_midia_mime as midiaMime,
            mensagem.vl_tamanho_arquivo as tamanhoArquivo,
            contato.no_contato as contato,
            contato.nu_contato as numeroContato,
            contato.raw_data as foto,
            mensagem.raw_data as raw,
            mensagem.id_topico as idTopico,
            mensagem.id_tipo_midia as tipoMidia
        from tb_mensagem mensagem 
        left join tb_contato contato on contato.id=mensagem.id_contato ";


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



    public function recuperarPorTopico($idTopico)
    {
        if(isset($idTopico)) {
            try {
                return $this->db->getList($this->queryAll . " where id_topico=$idTopico");
            }catch (Exception $e){
                throw new Exception($e);
            }
        }
        return null;
    }

    public static function getMensagem($id,$idReferencia,$remetente,$texto,$data,$dataRecebida,$midiaMime,$tamanhoArquivo,$contato,$numeroContato,$foto,$raw,$topico,$tipoMidia){
        $mensagem=array();

        $mensagem["id"]=$id;
        $mensagem["idReferencia"]=$idReferencia;
        $mensagem["remetente"]=$remetente;
        $mensagem["texto"]=isset($texto)? mb_convert_encoding($texto, 'UTF-8', 'UTF-8'):null;
        $mensagem["data"]=$data;
        $mensagem["dataRecebida"]=$dataRecebida;
        $mensagem["midiaMime"]=$midiaMime;
        $mensagem["tamanhoArquivo"]=$tamanhoArquivo;
        $mensagem["contato"]=$contato;
        $mensagem["numeroContato"]=$numeroContato;
        $mensagem["foto"]=$foto;
        $mensagem["raw"]=$raw;
        $mensagem["idTopico"]=$topico;
        $mensagem["tipoMidia"]=$tipoMidia;

        return $mensagem;
    }

    public static function converterMensagem($msg){
        if(isset($msg)) {
            $mensagem = array();

            $mensagem["id_referencia"] = $msg->id;
            $mensagem["fl_remetente"] = !$msg->remetente?0:1;
            $mensagem["ds_texto"] = isset($msg->texto)?utf8_encode($msg->texto):null;
            $mensagem["dt_data"] = $msg->data;
            $mensagem["dt_recebida"] = $msg->dataRecebida;
            $mensagem["ds_midia_mime"] = isset($msg->midiaMime)?$msg->midiaMime:null;
            $mensagem["vl_tamanho_arquivo"] = $msg->tamanhoArquivo;
            $mensagem["raw_data"] = isset($msg->raw)?$msg->raw:null;
            $mensagem["id_tipo_midia"] = $msg->tipoMidia;

            $topico= MensagemService::getTopico($msg->topico->id);
            if(isset($topico)) {
                $mensagem["id_topico"] = $topico["id"];
            }

            if(isset($msg->numeroContato)) {
                $contato = MensagemService::getContato($msg->numeroContato);
                if (isset($contato)) {
                    $mensagem["id_contato"] = $contato["id"];
                }
            }

            return $mensagem;
        }
        return null;
    }

    private static function getTopico($id){
        foreach (MensagemService::$topicos as $topico){
            if($topico["id_referencia"]==$id){
                return $topico;
            }
        }
        return $topico;
    }

    private static function getContato($numero){
        foreach (MensagemService::$contatos as $contato){
            if($contato["nu_numero"]==$numero){
                return $contato;
            }
        }
    }

    public function inserirMensagens($aparelho,$mensagens)
    {
        $topicosService=new TopicoService();
        MensagemService::$topicos=$topicosService->recuperarPorAparelho($aparelho["id"]);
        $contatoService=new ContatoService();
        MensagemService::$contatos=$contatoService->recuperarPorAparelho($aparelho["id"]);

        $ids=array();
        $tmp=array();
        foreach ($mensagens as $mensagem){
            $msg=MensagemService::converterMensagem($mensagem);
            if(isset($msg)){
                array_push($ids,$mensagem->id);
                array_push($tmp,$msg);
            }
        }
        if(count($tmp)>0) {
            $colunas=array("id_referencia"=>"i","fl_remetente"=>"i","ds_texto"=>"s","dt_data"=>"s","dt_recebida"=>"s","ds_midia_mime"=>"s","raw_data"=>"b",
                "vl_tamanho_arquivo"=>"i","id_tipo_midia"=>"i","id_topico"=>"i","id_contato"=>"i");

            $r = $this->db->insertListIntoTable($tmp, $colunas, "tb_mensagem","id_referencia");
            $resp=array();
            $resp["ids"]=$r["ids"];
            $resp["success"]=$r["status"];
            $resp["tipo"]="mensagem";
            return $resp;
        }
        return null;

    }

}

?>