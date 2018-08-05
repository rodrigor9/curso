        <div class="row">
            <div class="col-sm-12">
                <div class="registro">
                    <h1>¡Regístrate!</h1>
                    <div id="mensajes-server"></div>
                    <form>
                      <div class="form-group">
                        <label for="exampleInputEmail1">Nombre</label>
                        <input type="text" class="form-control" placeholder="Escriba su nombre(s)" id="name">
                      </div>
                      <div class="form-group">
                        <label for="exampleInputEmail1">Apellido paterno</label>
                        <input type="text" class="form-control" placeholder="Escriba su apellido paterno" id="apellidoPat">
                      </div>
                      <div class="form-group">
                        <label for="exampleInputEmail1">Apellido materno</label>
                        <input type="text" class="form-control" placeholder="Escriba su apellido materno" id="apellidoMat">
                      </div>
                      <div class="form-group">
                        <label for="exampleInputEmail1">Email</label>
                        <input type="email" class="form-control" aria-describedby="emailHelp" placeholder="ejemplo@dominio.com" id="email">
                      </div>
                      <div class="form-group">
                        <label for="exampleInputEmail1">Usuario:</label>
                        <input type="text" class="form-control"aria-describedby="emailHelp" placeholder="" id="user">
                      </div>
                      <div class="form-group">
                        <label for="exampleInputPassword1">Contraseña</label>
                        <input type="password" class="form-control" placeholder="Contraseña" id="pass">
                      </div>
                      
                    </form>
                    <button type="submit" class="btn btn-primary" id="btn-add-user" onclick="usuarios.addUser();">Entrar</button>
                </div>
            </div>
        </div>        