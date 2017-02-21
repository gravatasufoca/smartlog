<?php

class ArquivosHelper{

    public static $UPLOAD_PATH;

    static function init() {
       ArquivosHelper::$UPLOAD_PATH= $_SERVER['DOCUMENT_ROOT']."/smartlog/uploads/";
    }


    private $dirPath;
    private $idAparelho;


    function __construct($idAparelho){
        $this->dirPath=ArquivosHelper::$UPLOAD_PATH.$idAparelho."/";
        $this->idAparelho=$idAparelho;
        if(!file_exists($this->dirPath)){
            mkdir($this->dirPath,0777,true);
        }
    }

    public function getFile($id){
        if(file_exists($this->dirPath.$id)){
            return array("file"=> file_get_contents($this->dirPath.$id,FILE_BINARY),"mime"=>mime_content_type($this->dirPath.$id));
        }
        return null;
    }

    public function unpack($arquivo){
        $filename_path = md5(time().uniqid()).".zip";
        $decoded=base64_decode($arquivo);
        file_put_contents($this->dirPath.$filename_path,$decoded,FILE_BINARY);

        $this->descompactar($this->dirPath.$filename_path);
    }

    public function insertFile($name,$arquivo){
//        $decoded=base64_decode($arquivo);
        $pdfData = "";
        foreach ($arquivo as $byte) {
            $pdfData .= $byte;
        }
//        file_put_contents($this->dirPath.$name,$pdfData,FILE_BINARY);

        require_once "classes/service/mensagemService.php";
        $mensagemService=new MensagemService(null);
        $mensagemService->atualizarCarregados(array($name));
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
}
ArquivosHelper::init();
