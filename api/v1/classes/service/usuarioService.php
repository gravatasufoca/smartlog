<?php

require_once "classes/dao/dbHandler.php";

class UsuarioService
{

    private $db;

    function __construct()
    {
        $this->db = new DbHandler();
    }

    public function recuperar($id)
    {
        if (isset($id)) {
            $user = $this->db->getOneRecord("select * from tb_usuario where fl_ativo=1 and id='$id' ");

            if ($user != NULL) {
                $perfis = $this->recuperarPefis($id);
                $user['perfis'] = $perfis;

                $roles = array();
                $roles[0] = ("ROLE_LOGADO");
                $user['roles'] = $roles;

                if (count($perfis) == 1) {
                    $user['perfil'] = $perfis[0];
                }

                return $user;
            }
        }
        return null;
    }

    public function recuperarPorEmail($email,$senha)
    {
        if (isset($email)) {
            $user = $this->db->getOneRecord("select * from tb_usuario where fl_ativo=1 and ds_email='$email' " .(isset($senha) ?" and ds_senha='$senha' ":""));

            if ($user != NULL) {
                $perfis = $this->recuperarPefis($user['id']);
                $user['perfis'] = $perfis;

                $roles = array();
                $roles[0] = ("ROLE_LOGADO");
                $user['roles'] = $roles;

                if (count($perfis) == 1) {
                    $user['perfil'] = $perfis[0];
                }

            }
            return $user;
        }
        return null;
    }

    private function recuperarPefis($idUsuario)
    {
        return $this->db->getList("select no_aparelho as nome, id from tb_aparelho where fl_ativo=1 and id_usuario=$idUsuario");
    }

    public function inserir($usuario){
        if(isset($usuario)  && isset($usuario->ds_email) && isset($usuario->ds_senha)) {
            $colunas = array("ds_email", "ds_senha");

            $email = $usuario->ds_email;

            $isUserExists = $this->db->getOneRecord("select id,ds_senha from tb_usuario where fl_ativo=1 and ds_email='$email'");
            if(!$isUserExists) {
                $isUserExists = $this->db->insertIntoTable($usuario, $colunas, "tb_usuario");
            }else{
                if($isUserExists["ds_senha"]!=$usuario->ds_senha) {
                    return "Senha inválida";
                }
            }

            if(isset($usuario->perfil)){
                require_once "classes/service/aparelhoService.php";
                $aparelhoService=new AparelhoService();
                $usuario->perfil->id_usuario=$isUserExists["id"];
                $aparelhoService->inserir($usuario->perfil);
            }
           return $isUserExists["id"];
        }
        return null;
    }
}

?>