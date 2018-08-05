var eventos = {};


/**
* Elementos a manipular del usuario
* Se capturan los objetos html
**/
eventos.elementos = {
	nombre : $("#inputNombreEventos"),
    eventoId : $("#inputIDEventos"),
    subProgId : $("#inputIDSubEventos"),
    eventoDesc : $("#inputDescripcionEventos"),
	pais : $("#inputPaisEventos"),
	ciudad : $("#inputCiudadEventos"),
    entidad : $("#inputEntidadEventos"),
    fechaEvento : $("#inputFechaCreacionEventos"),
	 button : $("#btn-update-evento"),
};

eventos.verEvento = function (eventoId){

	//ocultamos el boton de acutalizar
	var update_button = $("#btn-update-evento");
	update_button.hide();

	$("#btn-delete-evento").show();


	utilerias.removeErrorMessages();
	$("#inputIDEventos").val(eventoId);	
	
    $.ajax({
		type: "POST",
		url: "ajax.php",
		data: {
			action: "getEvento",
			eventoId : eventoId
		},
		success: function(result){
			var res = JSON.parse(result);

			//ocultamos formulario
			$("#eventos").hide();

			//asignamos los valores a visualizar
			$("#vista-id").text(res.id_evento);
			$("#vista-nombre").text(res.nombre);
			$("#vista-desc").text(res.descripcion);
            $("#vista-subProgId").text(res.subprogramas_idsubprogramas);
			$("#vista-pais").text(res.pais);
			$("#vista-ciudad").text(res.ciudad);
            if(res.estado=="1")
			     $("#vista-estado").text("México");
		    $("#vista-entidad").text(res.entidad);
			$("#vista-fecha").text(res.fecha_creacion);
            
			//mostramos los datos en el contenedor
			$("#datos-evento").show();
			//cambiamos a visible el boton editar
			$("#btn-edit-evento").show();
		}
	});
};

eventos.addEvento = function (editMode) {
    var data  = eventos.elementos;
    var modal = $("#modal-add-edit-evento");
    var btn   = $("#btn-add-evento");
    var action = "addEvento";
    var eventoId = 0;
    var forUpdate = false;

    if ( editMode == true)
        forUpdate = true;

    if ( eventos.validaDatosEvento(data, forUpdate) ) {

       
        if ( editMode ) {
            action = "updateEvento";
            eventoId = $("#inputIDEventos").val();

        }      

        $.ajax({
			type: "POST",
			url: "ajax.php",
			dataType: "json",
			data: {
				id_evento : eventoId,
				nombre : data.nombre.val(),
                subprogramas_idsubprogramas : data.subProgId.val(),
                descripcion : data.eventoDesc.val(),
                fecha_creacion: data.fechaEvento.val(),
                pais: data.pais.val(),
                ciudad: data.ciudad.val(),
                entidad: data.entidad.val(),
                estado: "1",
				action : action
				},
			success: function(result){
				if(result.status == "error"){
					utilerias.displayErrorServerMessage($("#mensajes-server"),result.message);
				}else {
					$("#formulario-usuario :input").val('');
					utilerias.displaySuccessMessage($("#mensajes-server"),result.message);
				}
			}
		});		
    }
};


/**
* Funcion cuando se pulse el boton editar. 
* En este caso se muestra un formulario con los datos
**/
eventos.editEvento = function(){
	var data = eventos.elementos;
    var eventoId= data.eventoId.val();

    //mostramos el boton de agregar nuevo usuario
    data.button.show();
  $("#datos-evento").hide();
    //ocultamos el boton editar
    $("#btn-edit-user").hide();

    //activamos el de acutalizar
	var update_button = $("#btn-update-evento");
	update_button.show();
	update_button.attr('onclick','eventos.updateEvento()');

	//mostramos el formulario
	$("#eventos").show();

	//ocultamos datos de visualizacion
	$("#datos-usuario").hide();

	utilerias.removeErrorMessages();
	
    $.ajax({
		type: "POST",
		url: "ajax.php",
		data: {
			action: "getEvento",
			eventoId: eventoId
		},
		success: function(result){
			var res = JSON.parse(result);
            
            data.eventoId.val(res.id_evento);
			data.nombre.val(res.nombre);
            data.subProgId.val(res.subprogramas_idsubprogramas);
            data.eventoDesc.val(res.descripcion);
			data.pais.val(res.pais);
			data.ciudad.val(res.ciudad);
            if(res.entidad=="1")
			     data.entidad.val("uno");
			data.fechaEvento.val(res.fecha_creacion);
		}
	});
        
};


/**
* Funcion que llama a agregar nuevo usuario, con modalidad de actualizacion
**/
eventos.updateEvento = function () {
    eventos.addEvento(true);
};


eventos.verFormularioVacio = function(){
	location.reload();

	//activamos opcion para guardar
	var save_button = $("#btn-update-evento");
	save_button.show();
	update_button.attr('onclick','eventos.addEvento()');
}

eventos.deleteEvento = function(){
    var data = eventos.elementos;
    var eventoId= data.eventoId.val();
	var c= confirm('Estás seguro de esto?');
	if(c){
		$.ajax({
			type: "post",
			url: "ajax.php",
			data: {
				action: "deleteEvento",
				eventoId: eventoId
			},
			success: function(result){
				if(result.status == "error")
					utilerias.displayErrorMessage($("#mensajes-server"),result.message);
				else
					location.reload();
			}
		});
	}
};


/**
* Funcion para validar lod datos ingresados por el usuario
* !!! En caso de actualizacion, habría que validar si el correo se puede usar
**/
eventos.validaDatosEvento = function(data,forUpdate){
	var valid = true;
	var msg = "";
/*
	utilerias.removeErrorMessages();

	if($.trim(data.nombre.val())==""){
		valid = false;
		utilerias.displayErrorMessage(data.nombre,"El nombre de usuario es requerido");
	}
*/
	return valid;

};

/**
* Funcion para validar mail
* Tomado de http://www.w3schools.com/js/tryit.asp?filename=tryjs_form_validate_email
**/
