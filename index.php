<?php
error_reporting(-1);
ini_set('display_errors', 1);    

require_once("controller/sessionController.php");
require_once("controller/loginController.php");
require_once("controller/homeController.php");
require_once("controller/usuariosController.php");
require_once("controller/productoController.php");


sessionController::startSession(); 

$login        = new loginController();
$home        = new homeController();
$user         = new usuariosController();
$producto   = new productoController();

$option=isset($_REQUEST['op']) ?  $_REQUEST['op']: null;

  switch($option)
  {
    case 'login':
      $login->index();
      break;

    case 'logout':
      $login->logout();
        break;
    
    case 'newUser':
    	$user->nuevoUsuario();
        break;
          
    case 'users':
    	$user->index();
    	break;

    case 'newProducto':
        $producto->index();
        break;

    case 'productos':
        $producto->getAllProductos();
        break;
    case 'quienes':
        $home->quienes();
        break;

    default:    
        $home->index();
    break;


  }