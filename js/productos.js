var productos = {};

/**
* se capturan los inputs de la vista
**/
productos.elementos = {
	nombre: $("#view-nombre-programa"),
	descripcion: $("#descripcion"),
	precio: $("#precio"),
	peso: $("#peso"),
	longitud: $("#longitud"),
	anchura: $("#anchura"),
	altura: $("#altura"),
	stock: $("#stock"),
	imagenUrl: $("#imgUrl"),
};

/**
* Agregar un nuevo programa
**/
 $("#myForm").on('submit',(function() {
	var data = productos.elementos;
	var action = "addProducto";

	console.log("pasaaa");
	//if(productos.validaDatos(data)){
		$.ajax({
			type: "post",
			url: "ajax.php",
			data: {
				action: "addProducto"
			},
			success: function(result){
				if(result.status == "error"){
					//utilerias.displayErrorServerMessage(data.msj_server,result.message);
						console.log("error");

				}else{
					$("#formulario-productos :input").val('');
						console.log("aweb");

					//utilerias.displaySuccessMessage(data.msj_server,result.message);
					location.reload();
				}
			}
		});
	//}
}));

/**
* Valida los valores del formulario
**/
productos.validaDatos = function(data){
	var valid = true;

	utilerias.removeErrorMessages();

	if($.trim(data.nombre.val())==""){
		valid = false;
		utilerias.displayErrorMessage(data.nombre, "Se debe proporcionar un nombre");
	}

	if($.trim(data.descripcion.val())==""){
		valid = false;
		utilerias.displayErrorMessage(data.descripcion,"Se debe proporcionar una descripcion");
	}

	return valid;
};

/**
* Funcion cuando se da clic en algun elemento de la tabla.
* Permite visualizar la informacion en texto plano
**/
productos.verPrograma = function(idPrograma){

	var elem = productos.elementos;

	utilerias.removeErrorMessages();
	elem.id_programa.val(idPrograma);

	$.ajax({
		type: "post",
		url: "ajax.php",
		data: {
			action: "getPrograma",
			idPrograma: idPrograma
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
				

				$("#view-id-programa").text(res.id_programa);
				$("#view-nombre-programa").text(res.nombre);
				$("#view-descripcion-programa").text(res.descripcion);

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
productos.editPrograma = function(){
	var elem = productos.elementos;
	var idPrograma = elem.id_programa.val();

	utilerias.removeErrorMessages();

	$.ajax({
		type: "post",
		url: "ajax.php",
		data: {
			action: "getPrograma",
			idPrograma: idPrograma
		},

		success: function(result){
			var res = JSON.parse(result);

			if(res.status == "error"){
				utilerias.displayErrorServerMessage(elem.msj_server, res.message);
			}else{
				//mostramos y ocultamos botones correspondientes
				elem.btn_save.attr('onclick','productos.updatePrograma();');
				elem.btn_save.show();
				elem.btn_edit.hide();
				
				elem.nombre.val(res.nombre);
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
productos.updatePrograma = function(){
	var elem = productos.elementos;

	var idPrograma = elem.id_programa.val();

	if(productos.validaDatos(elem)){
		$.ajax({
			type: "post",
			url: "ajax.php",
			dataType: "json",
			data: {
				idPrograma : idPrograma,
				nombre: elem.nombre.val(),
				descripcion: elem.descripcion.val(),
				action: "updatePrograma"
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
productos.deletePrograma = function(){
	var elem = productos.elementos;
	var idPrograma = elem.id_programa.val();
	var c = confirm('Estás seguro de realizar la operación?');
	if(c){
		$.ajax({
			type: "post",
			url: "ajax.php",
			dataType: "json",
			data: {
				action: "deletePrograma",
				idPrograma: idPrograma
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






