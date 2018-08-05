<div class="row">
    <div class="col-sm-12">
        <div class="agregaProducto">
            <h1>Nuevo producto</h1>
            <div id="mensajes-server"></div>
            <form id="myForm" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="exampleInputEmail1">Nombre</label>
                    <input type="text" class="form-control"  id="nombre" required>
                </div>
                <div class="form-group">
                    <label for="exampleInputEmail1">Descripción</label>
                    <textarea id="descripcion" class="form-control"></textarea>
                </div>
                <div class="form-group">
                    <label for="exampleInputEmail1">Precio ($)</label>
                    <input type="number" class="form-control" placeholder="00/00 M.N." id="precio" required>
                </div>
                <div class="form-group">
                    <label for="exampleInputEmail1">Peso</label>
                    <input type="number" class="form-control" aria-describedby="emailHelp" placeholder="Kg" id="peso">
                </div>
                <div class="form-group">
                    <label for="exampleInputEmail1">Longitud</label>
                    <input type="text" class="form-control" placeholder="Mts" id="longitud">
                </div>
                <div class="form-group">
                    <label for="exampleInputEmail1">Anchura</label>
                    <input type="text" class="form-control" placeholder="Mts" id="anchura">
                </div>
                <div class="form-group">
                    <label for="exampleInputEmail1">Altura</label>
                    <input type="text" class="form-control" placeholder="Mts" id="altura">
                </div>
                <div class="form-group">
                    <label for="exampleInputEmail1">Stock</label>
                    <input type="number" class="form-control" value="1" id="stock" required>
                </div>

                <div class="form-group">
                    <label for="exampleInputPassword1">Imagen</label>
                    <input type="file" class="form-control" placeholder="" id="imgUrl" name="imgUrl">
                </div>
                <button type="submit" class="btn btn-primary" id="btn-add-producto">Agregar</button>
            </form>


        </div>
    </div>
</div>