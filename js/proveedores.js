var Proveedores = {};


/**
* Elementos a manipular del usuario
* Se capturan los objetos html
**/
Proveedores.elementos = {
	razon_social : $("#inputRazonProveedores"),
    id_proveedor : $("#inputIDProveedores"),
    tipo : $("#inputTipoProveedores"),
    rfc : $("#inputRFCProveedores"),
    cuenta : $("#inputCuentaProveedores"),
	banco : $("#inputBancoProveedores"),
    clabe : $("#inputCLABEProveedores"),    
	sucursal : $("#inputSucursalProveedores"),
    referencia : $("#inputReferenciaProveedores"),
    plaza : $("#inputPlazaProveedores"),
    colonia : $("#inputColoniaProveedores"),
    calle : $("#inputCalleYNumeroProveedores"),
    delegacion : $("#inputDelegacionYMunicipioProveedores"),
    pais : $("#inputPaisProveedores"),
    estado : $("#inputEstadoProveedores"),
    estado_text : $("#inputEstadoProveedores_text"),
    otro_text:  $("#otro_text"),
    cp : $("#inputCodigoPostalProveedores"),
    contacto: $("#inputContactoNombreProveedores"),
    correo_contacto : $("#inputContactoProveedores"),
    telefono : $("#inputNumeroProveedores"),
    btn_edit: $("#btn-edit-user"),
    btn_save: $("#btn-add-proveedor"),
    btn_delete: $("#btn-delete-user"),
   
	 button : $("#btn-update-proveedor"),
}; 

Proveedores.verProveedor = function (proveedorId){
    var elem= Proveedores.elementos;

	//ocultamos el boton de actualizar
	var update_button = $("#btn-update-proveedor");
	update_button.hide();
    
   
    
	$("#btn-delete-proveedor").show();


	utilerias.removeErrorMessages();
	$("#inputIDProveedores").val(proveedorId);	
	
    $.ajax({
		type: "POST",
		url: "ajax.php",
		data: {
			action: "getProveedor",
			id_proveedor : proveedorId
		},
		success: function(result){
			var res = JSON.parse(result);
            
            elem.btn_edit.show();
            elem.btn_delete.show();
            elem.btn_save.hide();
            
			//ocultamos formulario
			$("#ProveedoresDos").hide();
            $("#Proveedores").hide();
            
            //vista izq
			$("#vista-id").text(res.id_proveedor);
            
            if(res.tipo=="1")
                $("#vista-tipo").text("Proveedor");
            else
                $("#vista-tipo").text("Donatario");
            
            $("#vista-razon").text(res.razon_social);
            $("#vista-rfc").text(res.rfc);
            $("#vista-cuenta").text(res.cuenta);
            $("#vista-banco").text(res.banco);
            $("#vista-clabe").text(res.clabe);
            $("#vista-sucursal").text(res.sucursal);
            $("#vista-plaza").text(res.plaza);
            $("#vista-referencia").text(res.referencia);
            
	       //vista der
            $("#vista-colonia").text(res.colonia);
			$("#vista-calle").text(res.calle);
            $("#vista-delega").text(res.delegacion);
          
            $("#vista-pais").text(res.nombre_pais);          
            $("#vista-entidad").text(res.nombre_estado);
            $("#vista-cp").text(res.cp);
            $("#vista-contacto").text(res.contacto);
            $("#vista-correo").text(res.correo_contacto);
            $("#vista-numero").text(res.telefono);
            
			//mostramos los datos en el contenedor
			$("#vista-datos").show();
            $("#vista-datos2").show();
            
			//cambiamos a visible el boton editar
			// $("#btn-edit-proveedor").show();
		}
	});
};

Proveedores.pais = function (){
    var elem= Proveedores.elementos;
    var valor = document.getElementById("inputPaisProveedores").value;  
    
    if(valor=="1"){  /// Mèxico
        $("#inputEstadoProveedoresDiv").show();
        $("#inputEstadosEUA").hide();
        document.getElementById('inputEstadoProveedores_text').type = 'hidden';
        document.getElementById('otro_text').type = 'hidden';
        elem.estado.show();
    }else{
       if(valor=="2"){ /// EUA
            $("#inputEstadoProveedoresDiv").hide();
            $("#inputEstadosEUA").show();
            document.getElementById('otro_text').type = 'hidden';
            elem.estado.hide();
         } else{  /// Otro
            $("#inputEstadoProveedoresDiv").show();
            $("#inputEstadosEUA").hide();
            document.getElementById('inputEstadoProveedores_text').type = 'text';
            document.getElementById('otro_text').type = "text";
            
            elem.estado.hide();
         }
    }
};

Proveedores.addproveedor = function (editMode) {
    var data  = Proveedores.elementos;
    var action = "addProveedor";
    
    var proveedorId = 0;
    var forUpdate = false;

    var pais = document.getElementById("inputPaisProveedores").value;
    var estado = null;

    if(pais=="1"){
         estado = data.estado.val();  
    }else{
        if(pais=="2"){
            estado = document.getElementById("inputEstadosEUA").value;
        }else{
             /// si existe devuelve id de estado, sino insertalo y devuelve id
            estado = Proveedores.idEstado(data.estado_text.val());
        } 
    }
    
    if ( editMode == true)
        forUpdate = true;

    if ( Proveedores.validaDatosproveedor(data, forUpdate) ) {

       
        if ( editMode ) {
            action = "updateProveedor";
            proveedorId = $("#inputIDProveedores").val();
        }      

        $.ajax({
			type: "POST",
			url: "ajax.php",
			dataType: "json",
			data: {                 
                    id_proveedor : proveedorId,
                    razon_social : data.razon_social.val(),
                    tipo: data.tipo.val(),
                    rfc : data.rfc.val(),
                    cuenta : data.cuenta.val(),
                    clabe : data.clabe.val(),
                    banco : data.banco.val(), 
                    sucursal: data.sucursal.val(), 
                    plaza: data.plaza.val(),
                    referencia: data.referencia.val(), 
                    colonia: data.colonia.val(),
                    calle: data.calle.val(),
                    delegacion: data.delegacion.val(),
                    entidad: estado,
                    cp: data.cp.val(),
                    contacto: data.contacto.val(),
                    correo_contacto: data.correo_contacto.val(),
                    telefono: data.telefono.val(),
                    action : action
				},
			success: function(result){
				if(result.status == "error"){	      utilerias.displayErrorServerMessage($("#mensajes-server"),result.message);
				}else {
                    utilerias.displaySuccessMessage($("#mensajes-server"),result.message);
                    location.reload();
					$("#formulario-usuario :input").val('');                                     
				}
			}
		});		
    }
};

Proveedores.idEstado = function(estado){
        $.ajax({
            type: "POST",
            url: "ajax.php",
            dataType: "json",
            data: {                
                    estado: estado,
                    id_pais: 2,
                    action : "idEstado"
                },
                success: function(result){
                if(result.status == "error"){         
                    utilerias.displayErrorServerMessage($("#mensajes-server"),result.message);
                }else{
                    return result.estado;                                    
                }
            }
        });         
}


Proveedores.editproveedor = function(){
      var elem= Proveedores.elementos;
	var data = Proveedores.elementos;
    var proveedorId= data.id_proveedor.val();

    //mostramos el boton de agregar nuevo usuario
    data.button.show();
  $("#datos-proveedor").hide();
    //ocultamos el boton editar
    $("#btn-edit-user").hide();

    //activamos el de acutalizar
	data.btn_save.show();
	data.btn_save.attr('onclick','Proveedores.updateproveedor()');

	//mostramos el formulario
	$("#Proveedores").show();
    $("#ProveedoresDos").show();
	//ocultamos datos de visualizacion
	$("#vista-datos").hide();
    $("#vista-datos2").hide();
    
	utilerias.removeErrorMessages();
	

    $.ajax({
		type: "POST",
		url: "ajax.php",
		data: {
			action: "getProveedor",
			id_proveedor: proveedorId
		},
		success: function(result){
			var res = JSON.parse(result);
            
            data.btn_save.show();
            
            data.id_proveedor.val(res.id_proveedor);
            data.tipo.val(res.tipo);
			data.razon_social.val(res.razon_social);
            data.cuenta.val(res.cuenta);
			data.clabe.val(res.clabe); 
            data.banco.val(res.banco); 
            data.sucursal.val(res.sucursal);
            data.rfc.val(res.rfc);    
			data.referencia.val(res.referencia);   
            data.plaza.val(res.plaza);     
            data.calle.val(res.calle);    
            data.delegacion.val(res.delegacion); 

                  
            data.cp.val(res.cp); 
            data.colonia.val(res.colonia);  
            data.calle.val(res.calle);
            
            if(res.id_estado <= "32")
                {
                   elem.estado.show();
                   document.getElementById('inputEstadoProveedores_text').type = 'hidden';
                   data.estado.val(res.id_estado); 
                   data.pais.val(res.id_pais);   
                }else{
                    if(res.id_estado <= "82"){
                        document.getElementById('inputEstadoProveedores_text').type = 'text';
                        elem.estado.hide();
                        data.estado_text.val(res.nombre_estado);
                        data.pais.val(res.nombre_pais); 

                    }else{
                         document.getElementById('inputEstadoProveedores_text').type = 'text';
                         data.estado.val(res.nombre_estado);
                         data.otro_text.val(res.nombre_pais);
                         document.getElementById('otro_text').type = 'text';
                         elem.estado.hide();
                         
                         data.pais.val("Otro"); 
                    }
                }

            $("#inputEstadoProveedores").show();
            
            data.contacto.val(res.contacto);   
            data.correo_contacto.val(res.correo_contacto);   
            data.telefono.val(res.telefono);    
            
		}
	});

};
/**
* Funcion que llama a agregar nuevo usuario, con modalidad de actualizacion
**/
Proveedores.updateproveedor = function () {
    Proveedores.addproveedor(true);
};


Proveedores.verFormularioVacio = function(){
	location.reload();

	//activamos opcion para guardar
	var save_button = $("#btn-update-proveedor");
	save_button.show();
	update_button.attr('onclick','Proveedores.addproveedor()');
}

Proveedores.deleteproveedor = function(){
    var data = Proveedores.elementos;
    var proveedorId= data.id_proveedor.val();
	var c= confirm(' Esta acción eliminará el registro, ¿deseas continuar?');
	if(c){
		$.ajax({
			type: "post",
			url: "ajax.php",
			data: {
				action: "deleteProveedor",
				proveedorId: proveedorId
			},
			success: function(result){
				if(result.status == "error")
					utilerias.displayErrorMessage($("#mensajes-server"),result.message);
			     else
                     utilerias.displaySuccessMessage($("#mensajes-server"),result.message);
                     location.reload();
			}
		});
	}
};


/**
* Funcion para validar lod datos ingresados por el usuario
* !!! En caso de actualizacion, habría que validar si el correo se puede usar
**/
Proveedores.validaDatosproveedor = function(data,forUpdate){
	var valid = true;
    
	utilerias.removeErrorMessages();

    if($.trim(data.tipo.val())==""){
		valid = false;
		utilerias.displayErrorMessage(data.tipo,"El campo tipo es requerido.");
	}
	if($.trim(data.razon_social.val())==""){
		valid = false;
		utilerias.displayErrorMessage(data.razon_social,"Razón social es requerida.");
	}
    
    if($.trim(data.rfc.val())==""){
		valid = false;
		utilerias.displayErrorMessage(data.rfc,"El RFC es requerido");
	}
    
    var rfc = data.rfc.val();
    if(rfc.length < "12" || rfc.length > "14" ){
		valid = false;
		utilerias.displayErrorMessage(data.rfc,"El RFC no es válido");
	}

    var clabe = data.clabe.val();
    if(clabe.length == "18" ){
        valid = false;
        utilerias.displayErrorMessage(data.clabe,"La CLABE no es válida");
    }

    var cuenta = data.cuenta.val();
    if(cuenta.length == "11" ){
        valid = false;
        utilerias.displayErrorMessage(data.cuenta,"El número de cuenta no es válido");
    }

    if(data.telefono.val() != ""){
          var tel = data.telefono.val();
        if(tel.length < "10" || tel.length > "10" ){
    		valid = false;
    		utilerias.displayErrorMessage(data.telefono,"El teléfono no es válido. Recuerde agregar LADA.");
    	}
    }
    
    if(data.correo_contacto.val() != ""){
        if(!Proveedores.mailValido(data.correo_contacto.val())){
			valid = false;
			utilerias.displayErrorMessage(data.correo_contacto,"Formato de correo no válido")
		}
    }

	return valid;

};

/**
* Funcion para validar mail
* Tomado de http://www.w3schools.com/js/tryit.asp?filename=tryjs_form_validate_email
**/


Proveedores.mailValido = function(email){
    var atpos = email.indexOf("@");
    var dotpos = email.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {        
        return false;
	}
	return true;
};
