<?php

class ArquivosHelper{

    public static $UPLOAD_PATH;

    static function init() {
        ArquivosHelper::$UPLOAD_PATH= $_SERVER['DOCUMENT_ROOT']."/smartlog/uploads/";
        if(!file_exists(ArquivosHelper::$UPLOAD_PATH)){
            mkdir(ArquivosHelper::$UPLOAD_PATH);
        }
    }

    private $dirPath;
    private $idAparelho;

    function __construct($idAparelho){
        $this->dirPath=ArquivosHelper::$UPLOAD_PATH.$idAparelho."/";
        $this->idAparelho=$idAparelho;

        if(!file_exists($this->dirPath."arquivos")){
            mkdir($this->dirPath . "arquivos",0777,true);
//            exec("chmod -R 777 ".ArquivosHelper::$UPLOAD_PATH);
        }
    }

    public function getUpload($id){
        if(file_exists($this->dirPath.$id)){
            return array("file"=> file_get_contents($this->dirPath.$id,FILE_BINARY),"mime"=>mime_content_type($this->dirPath.$id));
//            return array("file"=> file_get_contents($this->dirPath.$id,FILE_BINARY),"mime"=>"");
        }
        return null;
    }

    public function getArquivo($id){
        $path=$this->dirPath."arquivos/".$id;
        if(file_exists($path)){
            return array("file" => file_get_contents($path, FILE_BINARY), "mime" => mime_content_type($path), "size" => filesize($path));
//            return array("file" => file_get_contents($path, FILE_BINARY), "mime" => "", "size" => filesize($path));
        }
        return null;
    }

    public function unpack($arquivo){
        $filename_path = md5(time().uniqid()).".zip";
//        $decoded=base64_decode($arquivo);
//        file_put_contents($this->dirPath.$filename_path,$decoded,FILE_BINARY);
        move_uploaded_file($arquivo['arquivo']['tmp_name'],$this->dirPath.$filename_path);

        $this->descompactar($this->dirPath.$filename_path);
    }

    public function insertUploads($name, $arquivo){

        move_uploaded_file($arquivo['arquivo']['tmp_name'],$this->dirPath.$name);
        require_once "classes/service/mensagemService.php";
        $mensagemService=new MensagemService(null);
        $mensagemService->atualizarCarregados(array($name));
    }

    public function insertArquivo($name, $arquivo){
        echoResponseClean(200, $name." - ".$arquivo);
        move_uploaded_file($arquivo['arquivo']['tmp_name'],$this->dirPath."arquivos/".$name);
        /*        require_once "classes/service/gravacaoService.php";
                $gravacaoService = new GravacaoService(null);
                $gravacaoService->atualizarRaw($name);*/
    }

    public function insertArquivoBase64($name,$arquivo){
        if(isset($arquivo) && $arquivo!="") {
            file_put_contents($this->dirPath . "arquivos/" . $name, base64_decode($arquivo));
        }
    }

    private function descompactar($filename_path)
    {

        try {
            $zip = new ZipArchive;
            if ($zip->open($filename_path)) {
                $ids=array();
                for( $i = 0; $i < $zip->numFiles; $i++ ){
                    $stat = $zip->statIndex( $i );
                    array_push($ids, (int) basename( $stat['name'] ));
                }

                $zip->extractTo($this->dirPath);
                require_once "classes/service/mensagemService.php";
                $mensagemService=new MensagemService(null);
                $mensagemService->atualizarCarregados($ids);

            }
            return true;
        }catch (Exception $e){
            return false;
        }finally{
            unlink($filename_path);
        }

    }

    public function deletarArquivo($id)
    {
        $path=$this->dirPath."arquivos/".$id;
        if(file_exists($path)){
            unlink($path);
        }
    }
}
ArquivosHelper::init();
