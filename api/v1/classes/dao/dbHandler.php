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

    public function insertListIntoTable($objs, $column_names, $table_name)
    {
        $query = "";
        $sep="";
        $valores="";
        foreach ($objs as $obj) {
            $c = (array)$obj;
            $keys = array_keys($c);
            $sep2="";
            $values = '';
            foreach ($column_names as $desired_key) { // Check the obj received. If blank insert blank into the array.
                if (!in_array($desired_key, $keys)) {
                    $$desired_key = null;
                } else {
                    $$desired_key = $c[$desired_key];
                }

//                $columns = $columns . $desired_key . ',';
                $values = $values . $sep2.($$desired_key == null ? "null" : "'" . $$desired_key . "'");
                if($sep2==""){
                    $sep2=",";
                }
            }
            $valores .= $sep."(" . $values . ")";
            if($sep==""){
                $sep=",";
            }
        }
        $columns = join(",", $column_names);
        $query .= "INSERT INTO " . $table_name . "(" . $columns . ") VALUES " . trim($valores, ',');
        try {
            $r = $this->conn->query($query) or die($this->conn->error . __LINE__);
        } catch (Exception $exception) {
            $exception->getCode();
        }
        if ($r) {
//            $new_row_id = $this->conn->insert_id;
            return $r;
        } else {
            return NULL;
        }
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
