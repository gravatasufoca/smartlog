<?php

require_once "classes/dao/dbHandler.php";

class usuarioService
{

    private $db;

    function __construct()
    {
        $this->db = new DbHandler();
    }

    public function recuperar($id)
    {
        if (isset($id)) {
            $user = $this->db->getOneRecord("select * from tb_usuario where id='$id' ");

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
            $user = $this->db->getOneRecord("select * from tb_usuario where ds_email='$email' " .(isset($senha) ?" and ds_senha='$senha' ":""));

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
        return $this->db->getList("select no_aparelho as nome, id from tb_aparelho where id_usuario=$idUsuario");
    }
}

?>