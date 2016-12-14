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
            if (!in_array($desired_key, $keys)) {
                $$desired_key = '';
            } else {
                $$desired_key = $c[$desired_key];
            }
            $columns = $columns . $desired_key . ',';
            $values = $values . "'" . $$desired_key . "',";
        }
        $query = "INSERT INTO " . $table_name . "(" . trim($columns, ',') . ") VALUES(" . trim($values, ',') . ")";
        $r = $this->conn->query($query) or die($this->conn->error . __LINE__);

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

}

?>
