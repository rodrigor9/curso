var especies = {};

/**
* se capturan los inputs de la vista
**/
especies.elementos = {
	id_especie: $("#view-id-especie"),
    idespecie: $("#inputIDEspecie"),
	descripcion: $("#inputDescripcionEspecie"),
	btn_add: $("#btn-add-especie"),
	btn_save: $("#btn-save"),
	btn_edit: $("#btn-edit"),
	btn_delete: $("#btn-delete"),
	msj_server: $("#mensajes-server"),
	formulario: $("#formulario-especies"),
	cont_datos: $("#datos-especies"),
};

especies.verFormularioVacio = function(){
    var data = especies.elementos;
    
	location.reload();

	data.btn_delete.hide();
}

/**
* Agregar un nuevo especie
**/
especies.add = function(){
	var data = especies.elementos;
	var action = "addEspecie";

	if(especies.validaDatos(data)){
		$.ajax({
			type: "post",
			url: "ajax.php",
			dataType: "json",
			data: {
				descripcion: data.descripcion.val(),
				action: action
				},
			success: function(result){
				if(result.status == "error"){
					utilerias.displayErrorServerMessage(data.msj_server,result.message);
				}else{
                    
                    
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
especies.validaDatos = function(data){
	var valid = true;

	utilerias.removeErrorMessages();

	if($.trim(data.descripcion.val())==""){
		valid = false;
		utilerias.displayErrorMessage(data.descripcion,"Se debe proporcionar una descripcion");
	}
    
    descip = data.descripcion.val();
    if( descip.length > 140 ){
       valid = false;
		utilerias.displayErrorMessage(data.descripcion,"Número de caracteres excedido."); 
        
    }
    

	return valid;
};

/**
* Funcion cuando se da clic en algun elemento de la tabla.
* Permite visualizar la informacion en texto plano
**/
especies.verespecie = function(idespecie){

	var elem = especies.elementos;

	utilerias.removeErrorMessages();
	elem.id_especie.val(idespecie);

	$.ajax({
		type: "post",
		url: "ajax.php",
		data: {
			action: "getEspecie",
			id_especie: idespecie
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

				$("#view-id-especie").text(res.id_especie);
				$("#view-descripcion-especie").text(res.descripcion);

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
especies.editespecie = function(){
	var elem = especies.elementos;
	var idespecie = elem.id_especie.val();

	utilerias.removeErrorMessages();

	$.ajax({
		type: "post",
		url: "ajax.php",
		data: {
			action: "getEspecie",
			id_especie: idespecie
		},

		success: function(result){
			var res = JSON.parse(result);

			if(res.status == "error"){
				utilerias.displayErrorServerMessage(elem.msj_server, res.message);
			}else{
				//mostramos y ocultamos botones correspondientes
				elem.btn_save.attr('onclick','especies.updateespecie();');
				elem.btn_save.show();
				elem.btn_edit.hide();
                elem.btn_delete.show();
				
				elem.idespecie.val(res.id_especie);
				elem.descripcion.val(res.descripcion);

				elem.formulario.show();
				elem.cont_datos.hide();
			}
		}
	});
};

/**
* Funcion para actualizar los datos
**/
especies.updateespecie = function(){
	var elem = especies.elementos;

	var idespecie = elem.id_especie.val();

	if(especies.validaDatos(elem)){
		$.ajax({
			type: "post",
			url: "ajax.php",
			dataType: "json",
			data: {
				id_especie : idespecie,
				descripcion: elem.descripcion.val(),
				action: "updateEspecie"
			},
			success: function(result){
				if(result.status == "error"){
					utilerias.displayErrorServerMessage(elem.msj_server,result.message);
				}else{
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
especies.deleteespecie = function(){
	var elem = especies.elementos;
	var idespecie = elem.id_especie.val();
	var c = confirm(' Esta acción eliminará el registro, ¿deseas continuar?');
	if(c){
		$.ajax({
			type: "post",
			url: "ajax.php",
			dataType: "json",
			data: {
				action: "deleteEspecie",
				id_especie: idespecie
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






