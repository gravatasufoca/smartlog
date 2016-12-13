<?php

require_once "classes/dao/dbHandler.php";

class TopicoService
{

    private $db;

    private $queryAll="select 
      topico.id, 
      topico.id_referencia as idReferencia, 
      topico.ds_nome as nome, 
      case topico.fl_grupo WHEN 1 then 'true' else 'false' end as grupo, 
      topico.id_aparelho as idAparelho ,
      mensagem.id as idMensagem,
      mensagem.ds_texto as texto,
      mensagem.dt_data as 'data',
      mensagem.dt_recebida as 'dataRecebida',
      contato.no_contato as contato,
      contato.nu_contato as numeroContato,
      contato.raw_data as foto,
      mensagem.fl_remetente as remetente ,
      mensagem.ds_midia_mime as midiaMime ,
      mensagem.id_tipo_midia as tipoMidia ,
      (SELECT group_concat(DISTINCT concat(no_contato,'#',nu_contato) SEPARATOR ',') FROM tb_mensagem WHERE id_topico=topico.id and fl_remetente=0 ) as contatos
      from tb_topico topico 
      inner JOIN tb_mensagem mensagem on mensagem.id=(
        SELECT id
        FROM tb_mensagem msg WHERE id_topico=topico.id
        ORDER BY msg.dt_data DESC
        limit 1
      )
      left join tb_contato contato on contato.id=mensagem.id_contato ";

    function __construct()
    {
        $this->db = new DbHandler();
    }

    public function recuperar($id)
    {
        if (isset($id)) {
           return $this->fixTopico($this->db->getOneRecord($this->queryAll." where topico.id='$id' "));
                    }
        return null;
    }

    public function recuperarPorReferencia($id)
    {
        if (isset($id)) {
            return $this->db->getOneRecord("select * from tb_topico where id_referencia='$id'");
        }
        return null;
    }


    public function recuperarPorAparelhoTipo($idAparelho, $tipo)
    {
        if(isset($idAparelho) && isset($tipo)) {
            try {
                $idTipo=getTipoMensagen($tipo);
                $result= $this->db->getList($this->queryAll." where topico.id_aparelho=$idAparelho and topico.tp_mensagem=$idTipo ORDER BY mensagem.dt_data DESC");
                $tmp=array();
                foreach ($result as $topico){
                    array_push($tmp,$this->fixTopico($topico));
                }
                return $tmp;//array_slice($tmp,82,1);
            }catch (Exception $e){
                throw new Exception($e);
            }
        }
        return null;
    }

    public function recuperarPorAparelho($idAparelho)
    {
        if(isset($idAparelho)) {
            try {
                $result= $this->db->getList($this->queryAll." where topico.id_aparelho=$idAparelho ORDER BY mensagem.dt_data DESC");
                $tmp=array();
                foreach ($result as $topico){
                    array_push($tmp,$this->fixTopico($topico));
                }
                return $tmp;//array_slice($tmp,82,1);
            }catch (Exception $e){
                throw new Exception($e);
            }
        }
        return null;
    }

    private function fixTopico($topico){
        require_once "classes/service/mensagemService.php";

        $mensagem=MensagemService::getMensagem($topico["idMensagem"],null,$topico["remetente"],
                                $topico["texto"],$topico["data"],$topico["dataRecebida"],
                                $topico["midiaMime"],null,$topico["contato"],$topico["numeroContato"],$topico["foto"],null,
                                $topico["id"],$topico["tipoMidia"]);

        $contatos=array();

        $tmp= explode(",", $topico["contatos"]);
        if($topico["remetente"]!="1") {
            foreach ($tmp as $contato) {
                $ctmp = explode("#", $contato);

                $tc = array();
                $tc["numero"] = $ctmp[1];
                $tc["nome"] = $ctmp[0];
                $tc["cor"] = "user_bgcolor_" . rand(1, 8);
                if ($mensagem["numeroContato"] == $tc["numero"]) {
                    $mensagem["cor"] = $tc["cor"];
                }

                array_push($contatos, $tc);
            }
        }

        $topico["mensagem"]=$mensagem;
        $topico["contatos"]=$contatos;
        return $topico;

    }

    public static function getTopico($topico){
        if(isset($topico)) {
            $top=array();
            $top["id_referencia"] = $topico->id;
            $top["ds_nome"] = isset($topico->nome)?mb_convert_encoding($topico->nome, 'UTF-8', 'UTF-8'):null;
            $top["fl_grupo"] = !$topico->grupo?0:1;
            $top["id_aparelho"] = $topico->idAparelho;
            $top["tp_mensagem"] = $topico->tipoMensagem;

            return $top;
        }
        return null;
    }

    public function inserirTopicos($aparelho,$topicos){
        $tmp=array();
        foreach ($topicos as $topico){
            $topico->idAparelho=(int)$aparelho["id"];
            $top=TopicoService::getTopico($topico);
            if(isset($top)){
                array_push($tmp,$top);
            }
        }
        if(count($tmp)>0) {
            $r = $this->db->insertListIntoTable($tmp, array("id_referencia"=>'i', "ds_nome"=>'s', "fl_grupo"=>'i', "id_aparelho"=>'i',"tp_mensagem"=>'i'), "tb_topico","id_referencia");
            $resp=array();
            $resp["ids"]=$r["ids"];
            $resp["success"]=$r["status"];
            $resp["tipo"]="topico";
            return $resp;
        }
        return null;
    }
}

?>