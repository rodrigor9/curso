<?php

include_once("sessionController.php");
include_once("model/m_productos.php");

class productoController {

    private $userId;
    public $model;

    public function __construct() {
        //$this->userId = $userId;
        $this->model = new m_productos();

    }

    public function index()
    {

        $usuarioId = sessionController::get("usuarioId");
        $username = sessionController::get("username"); 
        require_once("views/templates/header.php");
        require_once("views/newProducto.php");
        require_once("views/templates/footer.php");
    }


    public function nuevoProducto($postData){
        var_dump($postData); exit();
        $result = array();
        //$errors = false; // $this->validaDatos($postData);

        /* if(count($errors) > 0 ){
             $message = implode("<br>", $errors);

             $result = array(
                 "status" => "error",
                 "message" => $message
             );
         }else{*/

        $sourcePath = $_FILES['imagenUrl']['tmp_name'];       // Storing source path of the file in a variable
       // $targetPath = "upload/".$_FILES['file']['name']; // Target path where file is to be stored
        //move_uploaded_file($sourcePath,$targetPath) ;    // Moving Uploaded file

        var_dump($postData, $sourcePath); exit();
        if($this->model->nuevoProducto($postData)){
            $result = array(
                "status"=> "success",
                "message" => "Registro exitoso"
            );
        }else{
            $result = array(
                "status"=> "error"
            );
        }

        // }

        return $result;
    }


    public function getAllProductos()
    {

        $usuarioId = sessionController::get("usuarioId");
        $username = sessionController::get("username"); 
        $productos = $this->model->getAllProductos();
        require_once("views/templates/header.php");
        require_once("views/productos.php");
        require_once("views/templates/footer.php");
    }


    
} // fin de clase
