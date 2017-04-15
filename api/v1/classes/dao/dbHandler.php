<?php

class DbHandler
{

    private $conn;

    function __construct()
    {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();

//        $this->conn->query("SET NAMES 'utf8'");
    }

    /**
     * Fetching single record
     */
    public function getOneRecord($query)
    {
        $r = $this->conn->query($query . ' LIMIT 1') or die($this->conn->error . __LINE__);
        return $result = $r->fetch_assoc();
    }

    public function getList($query)
    {
        $r = $this->conn->query($query) or die($this->conn->error . __LINE__);

        $results = array();
        while ($row = $r->fetch_assoc()) {
            $results[] = $row;
        }

        return $results;
    }

    /**
     * Creating new record
     */
    public function insertIntoTable($obj, $column_names, $table_name)
    {

        $c = (array)$obj;
        $keys = array_keys($c);
        $columns = '';
        $values = '';
        foreach ($column_names as $desired_key) { // Check the obj received. If blank insert blank into the array.
           /* if (!in_array($desired_key, $keys)) {
                $$desired_key = '';
            } else {
                $$desired_key = $c[$desired_key];
            }*/
           if(in_array($desired_key,$keys) && isset($c[$desired_key])) {
               $columns = $columns . $desired_key . ',';
               $values = $values . "'" . $c[$desired_key] . "',";
           }
        }
        $query = "INSERT INTO " . $table_name . "(" . trim($columns, ',') . ") VALUES(" . trim($values, ',') . ")";
        $r = $this->conn->query($query);

        if ($r) {
            $new_row_id = $this->conn->insert_id;
            return $new_row_id;
        } else {
            return NULL;
        }
    }

    private function map($v){
        return "?";
    }

    public function insertListIntoTable($objs, $column_names, $table_name,$id_column)
    {
        $resultado=array();
        $coluns_keys=array_keys($column_names);
        $columns = join(",", $coluns_keys);
        $columns_values = join(",", array_map(function($v){return "?";},$coluns_keys));
        $query= "INSERT INTO " . $table_name . "(" . $columns . ") VALUES (" .$columns_values. ")";

        $stmt= $this->conn->prepare($query);
        if(!$stmt){
            throw new Exception("erro ao criar statement");
        }
        $valores=array();
        $tipos="";
        $cols="";
        $sep="";
        $index=0;
        foreach($column_names as $column=>$tipo){
            $tipos.=$tipo;
            eval("\$valor$index=$index;");
            $cols.=$sep."&\$valor$index";
            if($sep==""){
                $sep=",";
            }
            $index+=1;
        }

        eval("\$valores=array($cols);");
        call_user_func_array(
            array( $stmt, 'bind_param' ),
            array_merge(
                array($tipos),$valores
            )
        );

        $this->conn->query("START TRANSACTION");

        $ids=array();
        foreach ($objs as $obj){
            $c = (array)$obj;
            foreach($coluns_keys as $index=>$column){
                $valores[$index]=$c[$column];
            }
            if($stmt->execute()){
                array_push($ids,$c[$id_column]);
            }else{
                $stmt->error;
            }

        }
        $resultado["ids"]=$ids;

        $resultado["status"]=$this->conn->query("COMMIT");
        $stmt->close();
        return $resultado;

    }

    public function executeQuery($query)
    {
        if (isset($query)) {
            return $this->conn->query($query) or die($this->conn->error . __LINE__);
        }
        return null;
    }

    public function atualizaRawMensagem($raw,$id){

//        $this->conn->query( 'SET @@global.max_allowed_packet = ' . strlen( $raw ) + 1024 );

        $query="update tb_mensagem set raw_data=?,thumb_image=null where id=? ";
        $stmt= $this->conn->prepare($query);
        $stmt->bind_param("si", $raw, $id);
        if($stmt->execute()){
            $stmt->close();
            return true;
        }else{
            $stmt->error;
            $stmt->close();
            return false;
        }
    }

    public function atualizaRawGravacao($raw,$id){

        $query="update tb_arquivo set raw_data=? where id=? ";
        $stmt= $this->conn->prepare($query);
        $stmt->bind_param("si", $raw, $id);
        if($stmt->execute()){
            $stmt->close();
            return true;
        }else{
            $stmt->error;
            $stmt->close();
            return false;
        }
    }

    public function atualizarLocalizacao($id, $longitude,$latitude,$precisao){

        $query="update tb_localizacoes set vl_latitude=?, vl_longitude=?,vl_precisao=? where id=? ";
        //$query="update tb_localizacoes set vl_latitude=?,vl_longitude=?,vl_precisao=? where id=? ";
        $stmt= $this->conn->prepare($query);
        if($stmt) {
            $lat = $latitude . "";
            $lon = $longitude . "";
            $stmt->bind_param("ssdi",$latitude,$longitude,$precisao, $id);
            if ($stmt->execute()) {
                $stmt->close();
                return true;
            } else {
                $stmt->close();
                return false;
            }
        }

    }


    public function atualizarConfiguracao($configuracao){
        debug($configuracao);
        if(isset($configuracao->serverurl)) {
            debug("aqui");
            $query = "update tb_configuracao set  fl_avatar=?, fl_media=?, fl_whatsapp=?, fl_messenger=?, fl_wifi=?, vl_intervalo=?, sms_blacklist=?,calls_blacklist=?, serverurl=? where id_aparelho=? ";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("iiiiiisssi", $configuracao->avatar, $configuracao->media, $configuracao->whatsapp, $configuracao->messenger, $configuracao->wifi, $configuracao->intervalo, $configuracao->smsBlacklist, $configuracao->callsBlacklist, $configuracao->serverurl,$configuracao->id_aparelho);

        }else{
            $query = "update tb_configuracao set  fl_avatar=?, fl_media=?, fl_whatsapp=?, fl_messenger=?, fl_wifi=?, vl_intervalo=?, sms_blacklist=?,calls_blacklist=?  where id_aparelho=? ";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("iiiiiissi", $configuracao->avatar, $configuracao->media, $configuracao->whatsapp, $configuracao->messenger, $configuracao->wifi, $configuracao->intervalo, $configuracao->smsBlacklist, $configuracao->callsBlacklist, $configuracao->id_aparelho);
        }

        if($stmt->execute()){
            $stmt->close();
            return true;
        }else{
            $stmt->close();
            return false;
        }
    }

    public function limparMensagens($id){

        $this->conn->query("START TRANSACTION");
        $resp=false;
        if($this->conn->query("delete from tb_mensagem where id_topico in(select id from tb_topico where tp_mensagem in(0,1) and id_aparelho=$id) ")) {
            if($this->conn->query("delete from tb_topico where tp_mensagem in(0,1) and id_aparelho=$id ")){
                $resp=true;
            }
        }

        $this->conn->query("COMMIT");

        return $resp;
    }

    public function limparLigacoes($id){

        $this->conn->query("START TRANSACTION");
        $resp=false;

        $queryArquivo="delete
FROM tb_arquivo 
WHERE
  id IN (SELECT ligacao.id_arquivo
             FROM tb_ligacao ligacao
             WHERE ligacao.id_topico IN (SELECT id
                                         FROM tb_topico topico
                                         WHERE topico.id_aparelho = $id))";

        $queryLigacao="delete
             FROM tb_ligacao 
             WHERE id_topico IN (SELECT id
                                         FROM tb_topico topico
                                         WHERE topico.id_aparelho = $id)";


        $queryTopico="DELETE from tb_topico where id_aparelho=$id and not exists(SELECT count(1) from tb_ligacao lig where lig.id_topico=id)";


        if($this->conn->query($queryLigacao)) {
            if ($this->conn->query($queryArquivo)) {
                if ($this->conn->query($queryTopico)) {
                    $resp=true;
                }
            }
        }

        $this->conn->query("COMMIT");

        return $resp;
    }

}

?>
