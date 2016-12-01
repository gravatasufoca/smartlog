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
}

?>