var cargo = {};
/**
* cargor inputs vista cargo.php
**/
cargo.elem ={
    idCargo:      $("#id-cargo"),
    mesContable:    $("#inputMesContable"),
    fechaDoctoSalida:$("#inputFechaDoctoSalida"),
    doctoSalida:      $("#inputDoctoSalida"),
    concepto:       $("#inputConcepto"),
    cargo:          $("#inputCargo"),    
    formulario:     $("#formulario-cargo"),
    btnAdd:      $("#btnAdd"),
    btnUpdate:     $("#btnUpdate"),
    btnSave:       $("#btnSave"),
    btnCancel:     $("#btnCancel"),
};

/**
** Guardar y actualizar cargo
**/
cargo.add = function(editMode){
	var data = cargo.elem;
	var action = "addCargo";    
    var idCargo = 0;
    var forUpdate = false;
    
    if (editMode == true)
        forUpdate = true;   
    if((cargo.validaDatos(data))){
        data.btnSave.prop('disabled','true');          
        if ( editMode ) {
            action = "updateCargo";
        }   
        
        $.ajax({
            type: "post",
            url: "ajax.php",
            dataType: "json",
            data: {
                idCargo : data.idCargo.val(),
                mesContable:    data.mesContable.val(),
                fechaDoctoSalida: data.fechaDoctoSalida.val(),
                doctoSalida:      data.doctoSalida.val(), 
                concepto:       data.concepto.val(),
                cargo:          data.cargo.val(),
                action: action
            },
            success: function(result){
                if(result.status == "error"){
                    window.scrollTo(0,0);
                    utilerias.displayErrorServerMessage($("#mensajes-server"), result.message);
                }else{                   
                    window.scrollTo(0,0);   
                  utilerias.displaySuccessMessage($("#mensajes-server"),result.message);
                  location.reload();
              }
              data.btnSave.prop('disabled','false');
          }
      });
    }
};

/**
** Funcion para ver detalles de cargo
**/
cargo.editCargo = function (idCargo) {
    var elementos =  cargo.elem;  
    cargo.nuevo();      
    elementos.btnAdd.show();
    elementos.btnUpdate.show();
    elementos.btnSave.hide();
    $.ajax({
        type:   "post",
        url:    "ajax.php",
        data:   {
            action:"getCargo",
            idCargo : idCargo
        },
        success: function(result){
            var res = JSON.parse(result);

            if(res.status == "error"){
                utilerias.displayErrorServerMessage(elem.msj_server, res.message);
            }else{
                elementos.idCargo.val(res.idCargo);
                elementos.mesContable.val(res.mesContable);
                elementos.fechaDoctoSalida.val(res.fechaDoctoSalida);
                elementos.doctoSalida.val(res.doctoSalida);
                elementos.concepto.val(res.concepto);
                elementos.cargo.val(res.cargo);
            }
        }
    });
};

/**
** valida datos
**/
cargo.validaDatos = function (data) {
    var valid = true;
    utilerias.removeErrorMessages();
    
    if ($.trim(data.mesContable.val())=="") {
        valid = false;
        utilerias.displayErrorMessage(data.mesContable,"Se debe ingresar mes contable");
    }
    if (!utilerias.isValidDate(data.fechaDoctoSalida.val())) {
        valid = false;
        utilerias.displayErrorMessage(data.fechaDoctoSalida,"Fecha no válida");
    }
    if ($.trim(data.concepto.val())=="") {
        valid = false;
        utilerias.displayErrorMessage(data.concepto,"Se debe ingresar Concepto");
    }
    if (isNaN(data.cargo.val())) {
        valid = false;
        utilerias.displayErrorMessage(data.cargo,"Cargo no válido");
    }
    return valid;
};

/**
** Al dar click en nuevo
**/
cargo.nuevo = function(){
    cargo.elem.formulario[0].reset();
    cargo.elem.fechaDoctoSalida.val($.datepicker.formatDate('yy-mm-dd', new Date()));
    cargo.elem.btnAdd.hide();
    cargo.elem.btnUpdate.hide();
    cargo.elem.btnSave.show();
    utilerias.removeErrorMessages();
    $("#contenedorTabla").hide();
    $("#contenedorForm").show();
}

/**
** Click en cancelar para volver  a ver la tabla
**/
cargo.ocultarForm = function(){
    $("#contenedorTabla").show();
    $("#contenedorForm").hide();    
}

