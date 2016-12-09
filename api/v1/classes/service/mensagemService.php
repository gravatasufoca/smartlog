<?php

require_once "classes/dao/dbHandler.php";
require_once "classes/service/topicoService.php";

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

    public static function getMensagem($id,$idReferencia,$remetente,$texto,$data,$dataRecebida,$midiaMime,$tamanhoArquivo,$contato,$numeroContato,$raw,$topico,$tipoMidia){
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
            $mensagem["no_contato"] = isset($msg->contato)?utf8_encode($msg->contato):null;
            $mensagem["nu_contato"] = isset($msg->numeroContato)?$msg->numeroContato:null;
            $mensagem["raw_data"] = isset($msg->raw)?$msg->raw:null;
            $mensagem["id_tipo_midia"] = $msg->tipoMidia;

            $topicoService=new TopicoService();

            $topico= $topicoService->recuperarPorReferencia($msg->topico->id);
            if(isset($topico)) {
                $mensagem["id_topico"] = $topico["id"];
            }

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
            $colunas=array("id_referencia"=>"i","fl_remetente"=>"i","ds_texto"=>"s","dt_data"=>"s","dt_recebida"=>"s","ds_midia_mime"=>"s",
                "vl_tamanho_arquivo"=>"i","no_contato"=>"s","nu_contato"=>"s","id_tipo_midia"=>"i","id_topico"=>"i");

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