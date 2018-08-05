<?php
require_once("config/database.php");

class m_login{

    private $db = null;

    public function __construct(){             
        $this->db = Database::getInstance();
    }


    /**
    * Obtiene un usuario de la base de datos
    * @param username - nombre de usuario
    * @param password - password de usuario
    **/
    public function valida($username, $password)
    {    
        $query = $this->db->select(
                        "SELECT *
                         FROM cliente                         
                         WHERE email = :u AND pass = :p",
                         array(
                           "u" => $username,
                           "p" => $password
                         )
                      );     
            
        return $query;
    } 

}

?>
