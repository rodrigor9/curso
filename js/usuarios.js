var usuarios = {};


/**
* Elementos a manipular del usuario
* Se capturan los objetos html


**/

usuarios.elementos = {
    nombre: $("#name"),
    apellidoPat: $("#apellidoPat"),
    apellidoMat: $("#apellidoMat"),
	username : $("#user"),
    email : $("#email"),
	password : $("#pass"),
	button : $("#btn-add-user"),
};

/**
* Funcion para agregar un nuevo usuario
* Sirve tamien para editar un usuario
* si edit mode es verdadero, entonces se esta editando
**/
usuarios.addUser = function () {
    var data  = usuarios.elementos;
    var btn   = $("#btn-add-user");
    var action = "addUsuario";
   // var usuarioId = 0;
    //var forUpdate = false;

    /*if ( editMode == true)
        forUpdate = true;

    if ( usuarios.validaDatosUsuario(data, forUpdate) ) {

       
        if ( editMode ) {
            action = "updateUsuario";
           // usuarioId = $("#usuarioId").val();

        }  */    

        $.ajax({
			type: "POST",
			url: "ajax.php",
			dataType: "json",
			data: {
				// usuarioId : usuarioId,
                nombre : data.nombre.val(),
                apellidoPat : data.apellidoPat.val(),
                apellidoMat : data.apellidoMat.val(),
				user : data.username.val(),
                email: data.email.val(),
				pass : data.password.val(),
				action : action
				},
			success: function(result){
				if(result.status == "error"){
					utilerias.displayErrorServerMessage($("#mensajes-server"),result.message);
				}else {
					 window.location.href = "index.php?op=login";             
					// location.reload();
				}
			}
		});		
    // }
};


/**
* Funcion cuando se pulse el boton editar. 
* En este caso se muestra un formulario con los datos
**/
usuarios.editUser = function(){
	var data = usuarios.elementos;
    var userId= data.userId.val();

    //mostramos el boton de agregar nuevo usuario
    data.button.show();

    //ocultamos el boton editar
    $("#btn-edit-user").hide();

    //activamos el de acutalizar
	var update_button = $("#btn-update-user");
	update_button.show();
	update_button.attr('onclick','usuarios.updateUsuario()');

	//mostramos el formulario
	$("#cont-formulario").show();

	//ocultamos datos de visualizacion
	$("#datos-usuario").hide();

	
    if(userId >0){
    $.ajax({
		type: "POST",
		url: "ajax.php",
		data: {
			action: "getUsuario",
			userId: userId
		},
		success: function(result){
			var res = JSON.parse(result);

			data.username.val(res.nombre);
			data.email.val(res.email);
			data.password.val(res.password);
			data.password_conf.val(res.password);

			data.password.attr('placeholder', 'Deje en blanco si no desea cambiarlo');
			data.password_conf.attr('placeholder','Deje en blanco si no desea cambiarlo');
		}
	});
        }
};


/**
* Funcion que llama a agregar nuevo usuario, con modalidad de actualizacion
**/
usuarios.updateUsuario = function () {
    usuarios.addUser(true);
};


/**
* Funcion que permite ver los datos de un usuario, como texto plano
**/
usuarios.verUser = function(userId){

	//ocultamos el boton de acutalizar
	var update_button = $("#btn-update-user");
	update_button.hide();

	$("#btn-delete-user").show();



	utilerias.removeErrorMessages();
	$("#usuarioId").val(userId);	
	
    $.ajax({
		type: "POST",
		url: "ajax.php",
		data: {
			action: "getUsuario",
			userId: userId
		},
		success: function(result){
			var res = JSON.parse(result);

			//ocultamos formulario
			$("#cont-formulario").hide();

			//asignamos los valores a visualizar
			$("#vista-id").text(res.id_usuario);
			$("#vista-nombre").text(res.nombre);
			$("#vista-correo").text(res.email);

			//mostramos los datos en el contenedor
			$("#datos-usuario").show();

			//cambiamos a visible el boton editar
			$("#btn-edit-user").show();
		}
	});
};


/**
* Visualiza un formulario para insertar un usuario
**/
usuarios.verFormularioVacio = function(){
	location.reload();

	//activamos opcion para guardar
	var save_button = $("#btn-update-user");
	save_button.show();
	
}

usuarios.deleteUser = function(){
    var data = usuarios.elementos;
    var userId= data.userId.val();
	var c= confirm('Estás seguro de esto?');
	if(c){
		$.ajax({
			type: "post",
			url: "ajax.php",
			dataType: "json",
			data: {
				action: "deleteUsuario",
				usuarioId: userId
			},
			success: function(result){
				if(result.status == "error"){
					utilerias.displayErrorServerMessage($("#mensajes-server"),result.message);
				}
				else{
					utilerias.displaySuccessMessage($("#mensajes-server"),result.message);
					location.reload();					
				}
			}
		});
	}
};


/**
* Funcion para validar lod datos ingresados por el usuario
* !!! En caso de actualizacion, habría que validar si el correo se puede usar
**/
usuarios.validaDatosUsuario = function(data,forUpdate){
	var valid = true;
	var msg = "";

	utilerias.removeErrorMessages();

	if($.trim(data.username.val())==""){
		valid = false;
		utilerias.displayErrorMessage(data.username,"El nombre de usuario es requerido");
	}

	if($.trim(data.email.val())==""){
		valid = false;
		utilerias.displayErrorMessage(data.email,"El correo es requerido");
	}else{
		if(!usuarios.mailValido(data.email.val())){
			valid = false;
			utilerias.displayErrorMessage(data.email,"Formato de correo no válido")
		}
	}

	if(forUpdate == true){
		if(data.password.val() != data.password_conf.val()){
			valid = false;
			utilerias.displayErrorMessage(data.password_conf,"No coinciden los password");
		}

	} else{

		if($.trim(data.password.val())==""){
			valid = false;
			utilerias.displayErrorMessage(data.password,"El password es requerido");
		}else{
			if(data.password.val() != data.password_conf.val()){
				valid = false;
				utilerias.displayErrorMessage(data.password_conf, "Password no coincide");
			}
		}
	}

	return valid;

};

/**
* Funcion para validar mail
* Tomado de http://www.w3schools.com/js/tryit.asp?filename=tryjs_form_validate_email
**/
usuarios.mailValido = function(email){
    var atpos = email.indexOf("@");
    var dotpos = email.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {        
        return false;
	}
	return true;
};
