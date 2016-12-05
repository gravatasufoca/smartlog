<?php

require_once "classes/dao/dbHandler.php";

class MensagemService
{

    private $db;

    private $queryAll="select  id,
        id_referencia as idReferencia,
        case fl_remetente when 1 then 'true' else 'false' end as remetente,
        ds_texto  as texto,
        dt_data as data,
        dt_recebida as dataRecebida,
        ds_midia_mime as midiaMime,
        vl_tamanho_arquivo as tamanhoArquivo,
        no_contato as contato,
        nu_contato as numeroContato,
        raw_data as raw,
        tp_mensagem as tipoMensagem,
        id_topico as idTopico,
        id_tipo_midia as tipoMidia
from tb_mensagem ";




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

    public static function getMensagem($id,$idReferencia,$remetente,$texto,$data,$dataRecebida,$midiaMime,$tamanhoArquivo,$contato,$numeroContato,$raw,$tipoMensagem,$topico,$tipoMidia){
        $mensagem=array();

        $mensagem["id"]=$id;
        $mensagem["idReferencia"]=$idReferencia;
        $mensagem["remetente"]=$remetente;
        $mensagem["texto"]=$texto;
        $mensagem["data"]=$data;
        $mensagem["dataRecebida"]=$dataRecebida;
        $mensagem["midiaMime"]=$midiaMime;
        $mensagem["tamanhoArquivo"]=$tamanhoArquivo;
        $mensagem["contato"]=$contato;
        $mensagem["numeroContato"]=$numeroContato;
        $mensagem["raw"]=$raw;
        $mensagem["tipoMensagem"]=$tipoMensagem;
        $mensagem["idTopico"]=$topico;
        $mensagem["tipoMidia"]=$tipoMidia;

        return $mensagem;
    }

    public static function converterMensagem($msg){
        if(isset($msg)) {
            $mensagem = array();

            $mensagem["id_referencia"] = $msg->id;
            $mensagem["fl_remetente"] = $msg->remetente;
            $mensagem["ds_texto"] = $msg->texto;
            $mensagem["dt_data"] = $msg->data;
            $mensagem["dt_recebida"] = $msg->dataRecebida;
            $mensagem["ds_midia_mime"] = isset($msg->midiaMime)?$msg->midiaMime:null;
            $mensagem["vl_tamanho_arquivo"] = $msg->tamanhoArquivo;
            $mensagem["no_contato"] = isset($msg->contato)?$msg->contato:null;
            $mensagem["nu_contato"] = isset($msg->numeroContato)?$msg->numeroContato:null;
            $mensagem["raw_data"] = isset($msg->raw)?$msg->raw:null;
            $mensagem["tp_mensagem"] = $msg->tipoMensagem;
            $mensagem["id_topico"] = $msg->topico->id;
            $mensagem["id_tipo_midia"] = $msg->tipoMidia;

            return $mensagem;
        }
        return null;
    }

    public function inserirMensagens($mensagens)
    {
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
            //TODO: Nao esta funcionando!
            $r = $this->db->insertListIntoTable($tmp, array_keys($tmp[0]), "tb_mensagem");
            $resp=array();
            $resp["ids"]=$ids;
            $resp["success"]=$r;
            $resp["tipo"]="mensagem";
            return $resp;
        }
        return null;

    }

}

?>