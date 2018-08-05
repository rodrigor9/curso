var eventos = {};


/**
* Elementos a manipular del usuario
* Se capturan los objetos html
**/
eventos.elementos = {
	nombre :       $("#inputNombreEventos"),
    eventoId :     $("#vista-id"),
    subProgId :    $("#selectSubprograma"),
    eventoDesc :   $("#inputDescripcionEventos"),
    msj_server:    $("#mensajes-server"),
    button :       $("#btn-update-evento"),
    btn_editEvent: $("#btn-edit-evento"),
};

eventos.verEvento = function (eventoId){

	//ocultamos el boton de acutalizar
	var update_button = $("#btn-update-evento");
	update_button.hide();

	$("#btn-delete-evento").show();


	utilerias.removeErrorMessages();
	$("#vista-id").val(eventoId);	
	
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
            
            $("#vista-subProgId").text(res.nombre_subprograma);
            
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
            eventoId = $("#vista-id").val();

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
				action : action
				},
			success: function(result){
				if(result.status == "error"){
					utilerias.displayErrorServerMessage($("#mensajes-server"),result.message);
				}else {
					$("#formulario-usuario :input").val('');
					utilerias.displaySuccessMessage($("#mensajes-server"),result.message);
                    location.reload();
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
    //ocultamos el boton Editar
    data.btn_editEvent.hide();

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
		}
	});
        
};


/**
* Funcion que llama a agregar nuevo usuario, con modalidad de actualizacion
**/
eventos.updateEvento = function () {
    //eventos.addEvento(true);
    var data = eventos.elementos;
    
    if(eventos.validaDatosEvento(data)){
        $.ajax({
			type: "POST",
			url: "ajax.php",
			dataType: "json",
			data: {
				id_evento : data.eventoId.val(),
				nombre : data.nombre.val(),
                subprogramas_idsubprogramas : data.subProgId.val(),
                descripcion : data.eventoDesc.val(),
				action : "updateEvento"
				},
			success: function(result){
				if(result.status == "error"){
					utilerias.displayErrorServerMessage($("#mensajes-server"),result.message);
				}else {
					$("#formulario-usuario :input").val('');
					utilerias.displaySuccessMessage($("#mensajes-server"),result.message);
                    location.reload();
				}
			}
		});		
    }
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
	var c= confirm('Esta acción eliminará el registro, ¿deseas continuar? ');
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
        utilerias.removeErrorMessages();
    if($.trim(data.nombre.val())==""){
        valid = false;
        utilerias.displayErrorMessage(data.nombre,"Se debe ingresar el nombre del evento");
    }
    if($.trim(data.eventoDesc.val())==""){
        valid = false;
        utilerias.displayErrorMessage(data.eventoDesc," Se debe ingresar la descripción del evento");
    }
    return valid;
};

/**
* Funcion para validar mail
* Tomado de http://www.w3schools.com/js/tryit.asp?filename=tryjs_form_validate_email
**/
