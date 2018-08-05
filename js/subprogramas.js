var subprogramas = {};

/**
* se capturan los inputs de la vista
**/
subprogramas.elementos = {
	id_programa: $("#selectPrograma"),
	id_subprograma: $("#id-subprograma"),
	nombre: $("#inputNombreSubprogramas"),
	descripcion: $("#inputDescripcionSubprogramas"),
	btn_add: $("#btn-add-subprograma"),
	btn_save: $("#btn-save"),
	btn_edit: $("#btn-edit"),
	btn_delete: $("#btn-delete"),
	msj_server: $("#mensajes-server"),
	formulario: $("#formulario-subprogramas"),
	cont_datos: $("#datos-subprogramas"),
};

/**
* Agregar un nuevo programa
**/
subprogramas.add = function(){
	var data = subprogramas.elementos;
	var action = "addSubprograma";	

	if(subprogramas.validaDatos(data)){
		$.ajax({
			type: "post",
			url: "ajax.php",
			dataType: "json",
			data: {
				id_programa: data.id_programa.val(), 
				nombre: data.nombre.val(),
				descripcion: data.descripcion.val(),
				action: action
				},
			success: function(result){
				if(result.status == "error"){
					utilerias.displayErrorServerMessage(data.msj_server,result.message);
				}else{
					$("#formulario-subprogramas :input").val('');
					utilerias.displaySuccessMessage(data.msj_server,result.message);
					location.reload();
				}
			}
		});
	}
};

/**
* Valida los valores del formulario
**/
subprogramas.validaDatos = function(data){
	var valid = true;

	utilerias.removeErrorMessages();

	if($.trim(data.nombre.val())==""){
		valid = false;
		utilerias.displayErrorMessage(data.nombre, "Se debe proporcionar un nombre");
	}

	if($.trim(data.descripcion.val())==""){
		valid = false;
		utilerias.displayErrorMessage(data.descripcion,"Se debe proporcionar una descripción");
	}

	return valid;
};

/**
* Funcion cuando se da clic en algun elemento de la tabla.
* Permite visualizar la informacion en texto plano
**/
subprogramas.verSubprograma = function(idSubprograma){

	var elem = subprogramas.elementos;

	utilerias.removeErrorMessages();
	elem.id_subprograma.val(idSubprograma);

	$.ajax({
		type: "post",
		url: "ajax.php",
		data: {
			action: "getSubprograma",
			idSubprograma: idSubprograma
		},

		success: function(result){
			var res = JSON.parse(result);

			if(res.status == "error"){
				utilerias.displayErrorServerMessage(msj_server, res.message);
			}else{
				//mostramos y ocultamos botones correspondientes
				elem.btn_edit.show();
				elem.btn_save.hide();
				elem.btn_delete.show();
				

				$("#view-id-subprograma").text(res.id_subprograma);
				$("#view-nombre-subprograma").text(res.nombre);
				$("#view-descripcion-subprograma").text(res.descripcion);
				$("#view-nombre-programa").text(res.nombre_programa);

				elem.formulario.hide();
				elem.cont_datos.show();
			}
		}
	});
};

/**
* Cuando se da click en el icono editar
* Muestra los datos en el formulario
**/
subprogramas.editSubprograma = function(){
	var elem = subprogramas.elementos;
	var idSubprograma = elem.id_subprograma.val();

	utilerias.removeErrorMessages();

	$.ajax({
		type: "post",
		url: "ajax.php",
		data: {
			action: "getSubprograma",
			idSubprograma: idSubprograma
		},

		success: function(result){
			var res = JSON.parse(result);

			if(res.status == "error"){
				utilerias.displayErrorServerMessage(elem.msj_server, res.message);
			}else{
				//mostramos y ocultamos botones correspondientes
				elem.btn_save.attr('onclick','subprogramas.updateSubprograma();');
				elem.btn_save.show();
				elem.btn_edit.hide();
				
				elem.nombre.val(res.nombre);
				elem.descripcion.val(res.descripcion);

				elem.id_programa.val(res.id_programa);
				elem.formulario.show();
				elem.cont_datos.hide();
			}
		}
	});
};

/**
* Funcion para actualizar los datos
**/
subprogramas.updateSubprograma = function(){
	var elem = subprogramas.elementos;

	var idSubprograma = elem.id_subprograma.val();
	var idPrograma = elem.id_programa.val();

	if(subprogramas.validaDatos(elem)){
		$.ajax({
			type: "post",
			url: "ajax.php",
			dataType: "json",
			data: {
				id_programa : idPrograma,
				idSubprograma: idSubprograma,
				nombre: elem.nombre.val(),
				descripcion: elem.descripcion.val(),
				action: "updateSubprograma"
			},
			success: function(result){
				if(result.status == "error"){
					utilerias.displayErrorServerMessage(elem.msj_server,result.message);
				}else{
					$("#formulario-productos :input").val('');
					utilerias.displaySuccessMessage(elem.msj_server,result.message);
					location.reload();					
				}
			}
		});
	}
};



/**
* Al pulsar el icono borrar, se ejecuta la funcion
**/
subprogramas.deleteSubprograma = function(){
	var elem = subprogramas.elementos;
	var idSubprograma = elem.id_subprograma.val();
	var c = confirm('Estás seguro de realizar la operación?');
	if(c){
		$.ajax({
			type: "post",
			url: "ajax.php",
			dataType: "json",
			data: {
				action: "deleteSubprograma",
				idSubprograma: idSubprograma
			},
			success: function(result){
				if(result.status == "error"){
					utilerias.displayErrorServerMessage(elem.msj_server,result.message);
				}
				else{
					utilerias.displaySuccessMessage(elem.msj_server,result.message);
					location.reload();
				}
			}
		});
	}
};






