<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Tienda</title>
    <link rel="stylesheet" href="assets/css/home.css">
    <link rel="stylesheet" href="assets/css/registro.css">

      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
  </head>
  <body>
      
    <div class="container-expanded">
        <div class="row">
            <div class="col-sm-10 col-xs-12 col-lg-10 navDiv">
                
                <nav class="navbar navbar-expand-sm navbar-light">
                  <a href="index.php"><img src="assets/img/LOGOBLANCO.png" class="logo"></a>
                  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                  </button>

                  <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                      <li class="nav-item">
                        <a class="nav-link" href="index.php?op=productos">Productos</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="index.php?op=quienes">¿Quiénes somos?</a>
                      </li>
                      <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Categorías
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                          <a class="dropdown-item" href="#">Cascos</a>
                          <a class="dropdown-item" href="#">Barras</a>
                          <a class="dropdown-item" href="#">Hombreras</a>
                          <a class="dropdown-item" href="#">Cleats</a>
                          <a class="dropdown-item" href="#">Guantes</a>
                          <a class="dropdown-item" href="#">Calcetas y Mangas</a>
                          <a class="dropdown-item" href="#">Bicep Bands</a>
                          <a class="dropdown-item" href="#">Cortos</a>
                          <a class="dropdown-item" href="#">Productos NFL</a>
                        </div>
                      </li>
                        <li class="nav-item">
                          <?php if(isset($username)){
                                if($usuarioId==1){
                           ?>
                            <a class="nav-link warning" href="index.php?op=newProducto">Agregar productos</a>
                           <?php }
                                }else{ ?> 
                              <a class="nav-link warning" href="index.php?op=users">¡Regístrate!</a>
                            <?php } ?>
                        </li>
                    </ul>
                    <form class="form-inline my-2 my-sm-0">
                      <input class="form-control mr-sm-2" type="search" placeholder="Buscar" aria-label="Search">
                      <button class="btn btn-outline-warning my-2 my-sm-0" type="submit">Buscar</button>
                    </form>
                      <?php if(isset($username)){ 
                            echo "Bienvenido ".$username;
                      ?>
                       <a href="index.php?op=logout">Cerrar sesión</a>
                      <?php } ?>
                  </div>
                </nav>                 
            </div>
        </div>