<?php
include_once("sessionController.php");
include_once("model/m_login.php");

	class LoginController {

		public $model;
		
		public function __construct() {  
	        $this->model = new m_login();
	    } 
		
		public function index()
		{			
			if( $this->_isLoggedIn() ):
							
                $usuario = sessionController::get("username");		
				$titulo = "Panel de administración";				
				require_once("views/templates/header.php");
				require_once("views/index.php");
			    require_once("views/templates/footer.php");		

			else:
				require_once("views/login.php");
			endif;
		}


		public function login($email, $password)
		{			

			/*
            $errors = $this->_validateLoginFields($username, $password);
	        //if(count($errors) != 0) {
	            $result = implode("<br />", $errors);
	            echo json_encode(array(
	                'status' => 'error',
	                'message' => $result
	            ));
	        }

	        $logged=false;
	        
	        //revisamos credenciales en bd
	        */
	        $newPass= md5($password."seguro".$email);
	       // var_dump($newPass); die;
            $valida=$this->model->valida($email, $newPass);
	       	   
	        if(count($valida) == 1) {	 
		            sessionController::set("usuarioId", $valida[0]['id']); sessionController::set("email", $valida[0]['email']);
		            sessionController::set("username",$valida[0]['nombre']);            
		            echo json_encode(array(
		                'status' => 'success',
		                'message' => 'Loggeado'
		             ));
	        }else {	            	            
	             echo json_encode(array(
	                'status' => 'error',
	                'message' => 'Usuario y/o contraseña incorrectos'
	             ));
	        }
		}


		private function _validateLoginFields($username, $password)
		 {    
	        $errors = array();
	        
	        if($username == "")
	            $errors[] = 'Introduce el Usuario';
	        
	        if($password == "")
	            $errors[] = "El Password es obligatorio";
	        
	        return $errors;
	    }


	    public function _isLoggedIn() {
	        if(sessionController::get("usuarioId") == null)
	        	return false;
	                
	        return true;        
	    }

	     public function logout() {
	   		sessionController::destroySession();
	   		header('Location: index.php', TRUE, 302);       
	    }


	} // fin de clase