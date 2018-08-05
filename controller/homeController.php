<?php
include_once("sessionController.php");

	class homeController {

		public $model;
		
		public function __construct() {  
	    } 
		
		public function index()
		{			
            $usuarioId = sessionController::get("usuarioId");
            $username = sessionController::get("username");		
            require_once("views/templates/header.php");
			require_once("views/index.php");
            require_once("views/templates/footer.php");
		}

		public function quienes()
		{			
            $usuarioId = sessionController::get("usuarioId");
            $username = sessionController::get("username");	
            require_once("views/templates/header.php");
			require_once("views/quienes.php");
            require_once("views/templates/footer.php");
		}
    } // fin de la clase