<?php

class ArquivosHelper{

    public static $UPLOAD_PATH;

    static function init() {
//       ArquivosHelper::$UPLOAD_PATH= $_SERVER['DOCUMENT_ROOT']."/smartlog/uploads/";
       ArquivosHelper::$UPLOAD_PATH="/storage/external_storage/sdcard1/smartlog/uploads/";
    }


    private $dirPath;
    private $idAparelho;


    function __construct($idAparelho){
        $this->dirPath=ArquivosHelper::$UPLOAD_PATH.$idAparelho."/";
        $this->idAparelho=$idAparelho;

        if(!file_exists($this->dirPath)){
//            mkdir($this->dirPath."arquivos",0777,true);
            exec("su -c mkdir -p ".$this->dirPath."arquivos");
        }
        $this->permitir(ArquivosHelper::$UPLOAD_PATH);
    }

    private function permitir($path){
        exec("su -c chmod -R 777 ".$path);
    }

    public function getUpload($id){
        $this->permitir($this->dirPath.$id);
        if(file_exists($this->dirPath.$id)){
            return array("file"=> file_get_contents($this->dirPath.$id,FILE_BINARY),"mime"=>mime_content_type($this->dirPath.$id));
        }
        return null;
    }

    public function getArquivo($id){
        $path=$this->dirPath."/arquivos/".$id;
        $this->permitir($path);
        if(file_exists($path)){
            return array("file"=> file_get_contents($path,FILE_BINARY),"mime"=>mime_content_type($path),"size"=>filesize($path));
        }
        return null;
    }

    public function unpack($arquivo){
        $filename_path = md5(time().uniqid()).".zip";
        $decoded=base64_decode($arquivo);
        $this->permitir($this->dirPath);
        file_put_contents($this->dirPath.$filename_path,$decoded,FILE_BINARY);

        $this->descompactar($this->dirPath.$filename_path);
    }

    public function insertUploads($name, $arquivo){
        $this->permitir($this->dirPath);
        move_uploaded_file($arquivo['arquivo']['tmp_name'],$this->dirPath.$name);
        $this->permitir($this->dirPath);
        require_once "classes/service/mensagemService.php";
        $mensagemService=new MensagemService(null);
        $mensagemService->atualizarCarregados(array($name));
    }

    public function insertArquivo($name, $arquivo){
        $this->permitir($this->dirPath."arquivos/");
        move_uploaded_file($arquivo['arquivo']['tmp_name'],$this->dirPath."arquivos/".$name);
        $this->permitir($this->dirPath."arquivos/");
        /*        require_once "classes/service/gravacaoService.php";
                $gravacaoService = new GravacaoService(null);
                $gravacaoService->atualizarRaw($name);*/
    }

    private function descompactar($filename_path)
    {

        try {
            $this->permitir($filename_path);
            $zip = new ZipArchive;
            if ($zip->open($filename_path)) {
                $ids=array();
                for( $i = 0; $i < $zip->numFiles; $i++ ){
                    $stat = $zip->statIndex( $i );
                     array_push($ids, (int) basename( $stat['name'] ));
                }
                $this->permitir($this->dirPath);
                $zip->extractTo($this->dirPath);
                $this->permitir($this->dirPath);
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
}
ArquivosHelper::init();
