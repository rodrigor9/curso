var apoyo = {};

//busqueda por rango de fechas
$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var min = $('#fechaMin').val();
        var max = $('#fechaMax').val();
        var date = data[5]; // use data for the date column
 
        if ( ( !utilerias.isValidDate( min ) && !utilerias.isValidDate( max ) ) ||
             ( !utilerias.isValidDate( min ) && date <= max ) ||
             ( min <= date   && !utilerias.isValidDate( max ) ) ||
             ( min <= date   && date <= max ) )
        {
            return true;
        }
        return false;
    }
);

/**
** DATATABLE
**/
$(document).ready(function() {

    apoyo.tabla = $('#tabla-apoyos').DataTable( {
        ajax: "index.php?op=getApoyos"
    } );

    $('#tabla-apoyos tbody').on('click','tr',function(){
        apoyo.verApoyo($(this).find('td').first().text());
    });
     
    // Event listener to the two range filtering inputs to redraw on input
    // $('#fechaMin, #fechaMax').keyup( function() {
    //     apoyo.tabla.draw();
    // } );

    $("#todos").click(function(){
        apoyo.tabla.column(6).search(".",true,false).draw();
    });

    $("#activos").click(function(){
        apoyo.tabla.column(6).search("Activo",false,false).draw();
    });

    $("#cancelados").click(function(){
        apoyo.tabla.column(6).search("Cancelado",false,false).draw();
    });

    //filtro activo por año
    $("#anio").change(function(){
        apoyo.tabla.column(5).search($(this).val(),false,false).draw();
    });

    //busqueda por folio
    $("#folio").keyup(function(){
        if($.trim($(this).val()))
            apoyo.tabla.column(0).search("^"+$(this).val()+"$",true,false).draw();
        else{
            apoyo.tabla.column(0).search( '.',true,false ).draw();
        }
    });

    //rango de fechas
    $('#fechaMin, #fechaMax').change( function() {
        apoyo.tabla.draw();
    } );


} );


/**
* inputs de la vista apoyo.php
**/
apoyo.elem ={
    folio:         $("#folio_apoyo"),
    estatus:    $("#status"),
    concepto:    $("#concepto"),
    fechaCaptura:          $("#fechacaptura"),  
    frecuencia:         $("#frecuencia"),
    evento:            $("#evento"),
    proveedor:          $("#proveedor"),
    donatario:          $("#donatario"),
    tipoApoyo: $("#tipo_apoyo"),
    especie:             $("#id_especie"),    
    cantidad:             $("#cantidad"),
    otraUnidad:          $("#otra_unidad"),
    unidad:                 $("#unidad"),
    pais:                 $("#paises"), 
    estadosMex:          $("#estadosMex"),
    estadosEua: $("#estadosEua"),    
    otroEstado:                 $("#otroEstado"),
    abono:        $("#abono"),    
    moneda:         $("#moneda_apoyo"),
    numeroReferencia: $("#numeroReferencia"),
    fechaReferencia : $("#fecha_referencia"),
    observaciones:         $("#observaciones"),
    // campos libreta flujo
    mesContable:          $("#mescontable"),
    fechaDoctoSalida:          $("#fechadoctosalida"),
    doctoSalida:           $("#documentosalida"),     
    poliza:          $("#poliza"),   
    abono2:        $("#abono2"),
    //botones fijos
    btnSave:       $("#btn-save"),
    btnAdd:       $("#btn-add"),
    btnUpdate: $("#btn-update")
};

/**
* Recarga los datos en la tabla
**/
apoyo.loadTable = function(){
    apoyo.tabla.ajax.reload();
}

/**
** Detalle de un apoyo
** Muestra todos los datos seleccionados en la tabla
**/
apoyo.verApoyo = function(idApoyo){
    var data = apoyo.elem;    
    $("#datable").hide();
    $("#contenedor-apoyos").show();
    utilerias.removeErrorMessages();
    apoyo.nuevo(); //limpiamos formulario
    
    $.ajax({
        type:   "post",
        url:    "ajax.php",
        data:   {
            action:"getApoyo",            
            idApoyo:  idApoyo
        },
        success: function(result){
			var res = JSON.parse(result);
            
			if(res.status == "error"){
				utilerias.displayErrorServerMessage($("#mensajes-server"), res.message);
			}else{
                data.btnAdd.show();
                data.btnSave.hide();
                data.btnUpdate.show();

                data.folio.val(res.idApoyo); 
                data.estatus.val(res.estatus);
                data.concepto.val(res.concepto);
                data.abono.val(res.importeReal);               
                data.fechaCaptura.val(res.fechaCaptura);
                data.frecuencia.val(res.idFrecuencia);
                data.evento.val(res.idEvento);

                if(res.tipoProveedor==0)                
                    data.proveedor.val(res.idProveedor);
                else
                    data.donatario.val(res.idProveedor);                

                //apoyo en especie
                if(res.idEspecie){ 
                    data.tipoApoyo.val(0);                  
                    data.especie.val(res.idEspecie);
                   data.cantidad.val(res.cantidad);
                   data.unidad.val(res.idUnidad);
                   $('.especie:not(#div_otro)').show();
                }
                else
                    data.tipoApoyo.val(1);
                
                //datos pais
                data.pais.val(res.idPais);
                if(res.idPais==1)
                    data.estadosMex.val(res.idEstado);
                else if(res.idPais==2){
                        data.estadosEua.val(res.idEstado);
                    }else{
                        $("#estados option."+res.idPais).clone().appendTo($("#otroEstado").empty());
                        data.otroEstado.val(res.idEstado);
                    }
                apoyo.pais();

                data.abono.val(res.importe);
                data.moneda.val(res.idMoneda);
                data.numeroReferencia.val(res.referencia);
                data.fechaReferencia.val(res.fechaReferencia);
                data.observaciones.val(res.observaciones);
                data.mesContable.val(res.mesContable);
                data.fechaDoctoSalida.val(res.fechaDoctoSalida);
                data.doctoSalida.val(res.doctoSalida);
                data.poliza.val(res.poliza);
                data.abono2.val(res.importe);
            }
        }
    });
};

/**
* Funcion para guardar y actualizar apoyos
**/
apoyo.add = function(editMode){
	var data = apoyo.elem;
	var action = "addApoyo";
    var forUpdate = false;
	if(apoyo.validaDatos(data,forUpdate)){
        if ( editMode ) {
            action = "updateApoyo";;
        }            
		$.ajax({
            type: "post",
            url: "ajax.php",
            dataType: "json",
            data: {
                    idApoyo : data.folio.val(),
                    estatus: data.estatus.val(),
                    concepto: data.concepto.val(),
                    fechaCaptura: data.fechaCaptura.val(),
                    frecuencia: data.frecuencia.val(),
                    evento: data.evento.val(),
                    proveedor: data.proveedor.val(),
                    donatario: data.donatario.val(),
                    tipoApoyo: data.tipoApoyo.val(),
                    especie: data.especie.val(),
                    cantidad: data.cantidad.val(),
                    otraUnidad: data.otraUnidad.val(),
                    unidad: data.unidad.val(),
                    pais: data.pais.val(),
                    estado: apoyo.getEstado(),
                    abono: data.abono.val(),
                    moneda: data.moneda.val(),
                    numeroReferencia: data.numeroReferencia.val(),
                    fechaReferencia: data.fechaReferencia.val(),
                    observaciones: $.trim(data.observaciones.val()),
                    // campos lireta flujo
                    mesContable : data.mesContable.val(),
                    fechaDoctoSalida: data.fechaDoctoSalida.val(),
                    doctoSalida: data.doctoSalida.val(),
                    poliza: data.poliza.val(),
                    action: action
                },
                success: function(result){
                if(result.status == "error"){
                    utilerias.displayErrorServerMessage($("#mensajes-server"), result.message);
                    window.scrollTo(0,0);
                    
                }else{  
                        window.scrollTo(0,0);
                         utilerias.displaySuccessMessage($("#mensajes-server"),result.message);
                         location.reload();
                     }
                }
        });
	}
};

/**
* Valida datos del formulario para nuevos apoyos
**/
apoyo.validaDatos = function (data) {
    var valid = true;
    utilerias.removeErrorMessages();
    
    
    if (!$.trim(data.concepto.val())) {
        valid = false;
        utilerias.displayErrorMessage(data.concepto,"Se debe ingresar una descripcion");
    }

    //proveedor xor donatario
    if ( ((data.proveedor.val()!=0) && (data.donatario.val()!=0) )
        ||((data.proveedor.val()==0) && (data.donatario.val()==0)) ){
        valid = false;
        utilerias.displayErrorMessage(data.proveedor,"Se debe seleccionar o un proveedor o un donatario");
        utilerias.displayErrorMessage(data.donatario,"");
    }   
    
    if (!$.trim(data.evento.val()) ) {
        valid = false;
        utilerias.displayErrorMessage(data.evento,"Debe ingresar un evento");
    }

    //especie seleccionada
    if(data.tipoApoyo.val()==0 ){
        if(data.unidad.val()==0 && !$.trim(data.otraUnidad.val()) ){ 
            utilerias.displayErrorMessage(data.otraUnidad,"Debes especificar una unidad para la especie seleccionada");
            $("#div_otro").show();
            valid = false;
        }
        if (!(data.cantidad.val()>0)) {
            utilerias.displayErrorMessage(data.cantidad,"Debe ingresar un número");
            valid = false; 
        }
    }
    /*
    if(!$.trim(data.numeroReferencia.val())){
        valid = false;
        utilerias.displayErrorMessage(data.numeroReferencia,"Debe ingresar un numero de referencia");
    }
    */
    if(!utilerias.isValidDate(data.fechaReferencia.val())){
        valid = false;
        utilerias.displayErrorMessage(data.fechaReferencia,"Formato de fecha no válido.");
    }

    if(!utilerias.isValidDate(data.fechaCaptura.val())){
        valid = false;
        utilerias.displayErrorMessage(data.fechaCaptura,"Formato de fecha no válido.");
    }    

    if(!(data.abono.val()>=0)){
        valid=false;
        utilerias.displayErrorMessage(data.abono,"Debes ingresar un importe válido");
    }    

    if($.trim(data.fechaDoctoSalida.val()) 
        && !utilerias.isValidDate(data.fechaDoctoSalida.val())){
        valid = false;
        utilerias.displayErrorMessage(data.fechaDoctoSalida,"Formato de fecha no válido");
    }

    return valid;
};

/**
* Obtiene el id del estado dependiendo del pais que esta seleccionado
**/
apoyo.getEstado = function(){
    var pais = apoyo.elem.pais.val();
    var estado = 0;
    if(pais == 1){
        estado = apoyo.elem.estadosMex.val();
    }else if(pais == 2){
        estado = apoyo.elem.estadosEua.val();
        }else
            estado = apoyo.elem.otroEstado.val();

    return estado;
};


/**
* click en el boton nuevo
**/
apoyo.nuevo = function(){
    $("#formulario-captura-apoyos")[0].reset();
    $('.especie').hide();
    $("#estadosEuaDiv").hide();
    $("#otroEstadoDiv").hide();
    utilerias.removeErrorMessages();
    apoyo.elem.fechaCaptura.val($.datepicker.formatDate('yy-mm-dd', new Date()));
    apoyo.elem.fechaReferencia.val($.datepicker.formatDate('yy-mm-dd', new Date()));
    apoyo.elem.btnAdd.hide();
    apoyo.elem.btnUpdate.hide();
    apoyo.elem.btnSave.show();
};

/**
* cuando se selecciona un pais
**/
apoyo.pais = function (){
    var pais = apoyo.elem.pais.val();
    if(pais =="1"){ //mex
        $("#estadosMexDiv").show();
        $("#estadosEuaDiv").hide();
        $("#otroEstadoDiv").hide();      
    }else 
        if(pais == "2"){ //eua
            $("#estadosMexDiv").hide();
            $("#estadosEuaDiv").show();
            $("#otroEstadoDiv").hide();  
        }else{
            $("#estadosMexDiv").hide();
            $("#estadosEuaDiv").hide();
            $("#otroEstadoDiv").show();             
            $("#estados option."+pais).clone().appendTo($("#otroEstado").empty());
        }
};

/**
* Evento al seleccionar tipo de apoyo, unidad o especie
**/
apoyo.tipoApoyo = function () {
    if(apoyo.elem.unidad == 0)
        apoyo.elem.otraUnidad.show();   
};




apoyo.verPolizaSinCheque = function(){

    var data = apoyo.elem;

    /*
        var postData = 
                    {
                        "proveedor": data.proveedor.val(),
                        "donatario": data.donatario.val(),
                        "abono": data.abono.val()
                    };
        var dataString = JSON.stringify(postData);
    */
    var prov = document.getElementById("proveedor");
    var dona = document.getElementById("donatario");

    var idApoyo = data.idApoyo.val();
    var proveedor= prov.options[prov.selectedIndex].text;
    var donatario= dona.options[dona.selectedIndex].text;
    var abono= data.abono.val();
    var concepto= data.concepto.val();
 if(abono) abono= data.abono.val(); else abono = 0.00;
    
           /*   $.ajax({
                    type: "post",
                    url: "views/poliza_sin_cheque.php",
                    dataType: "json",
                    data: {
                            proveedor: data.proveedor.val(),
                            donatario: data.donatario.val(),
                            abono: data.abono.val()
                        },
                        success:  function (response) {
                                setTimeout(window.location='index.php?op=poliza',3000);
                        }
                                                       
                });
              */


             // window.location.href='index.php?op=poliza';
    //setTimeout(window.location='index.php?op=poliza',3000);
    window.open('index.php?op=poliza&concepto='+concepto+'&proveedor='+proveedor+'&donatario='+donatario+'&abono='+abono,'_blank');
};

apoyo.verCuenta = function(){

    var data = apoyo.elem;

    var cuenta= document.getElementById("cuenta_nombre");
    var firma= document.getElementById("firma_cambio");
    var moneda= document.getElementById("moneda_modal");
    var evento= document.getElementById("evento");
    var abono= document.getElementById("abono").value;
    var tipo= document.getElementById("tipo_cambio").value;
    var fecha= document.getElementById("fecharecibo").value;
    var concepto= document.getElementById("concepto").value;
    var folio = document.getElementById("folio_apoyo").value;
    var proveedor = document.getElementById("proveedor");
    var donatario = document.getElementById("donatario");
    var factura = document.getElementById("numerodefactura").value;
    var observaciones = document.getElementById("observaciones").value;
    var moneda = document.getElementById("moneda_modal").value;
    var fecha_cambio = document.getElementById("fecha_cambio").value;
    
       
    proveedor = proveedor.options[proveedor.selectedIndex].text;

 if(!proveedor) proveedor = donatario.options[donatario.selectedIndex].text;

 if(abono) abono= abono; else abono = 0.00;
    evento = evento.options[evento.selectedIndex].text;
    firma = firma.options[firma.selectedIndex].text;
    cuenta = cuenta.options[cuenta.selectedIndex].text;
 

  if(moneda == "1"){
        $.ajax({
                type: "post",
                url: "ajax.php",
                dataType: "json",
                data: {
                        idApoyo : data.idApoyo.val(),
                        tipo_cambio : tipo,
                        fecha_cambio: fecha,
                        moneda: moneda,
                        folio: data.folio_apoyo.val(),
                        action: "updateImporteApoyo"
                    },
                    success: function(result){
                    if(result.status == "error"){
                        utilerias.displayErrorServerMessage(elem.msj_server, result.message);                      
                    }else{  
                         if(result.importe != "0.00")
                            abono = result.importe;

                             utilerias.displaySuccessMessage($("#mensajes-server"),result.message);
                            window.open('index.php?op=cuenta&observaciones='+observaciones+'&factura='+factura+'&proveedor='+proveedor+'&folio='+folio+'&abono='+abono+'&concepto='+concepto+'&cuenta='+cuenta+'&firma='+firma+'&moneda='+moneda+'&tipo='+tipo+'&fecha='+fecha+'&evento='+evento,'_blank');
                         }
                    }
            });
   }else{
            window.open('index.php?op=cuenta&observaciones='+observaciones+'&factura='+factura+'&proveedor='+proveedor+'&folio='+folio+'&abono='+abono+'&concepto='+concepto+'&cuenta='+cuenta+'&firma='+firma+'&moneda='+moneda+'&tipo='+tipo+'&fecha='+fecha+'&evento='+evento,'_blank');
   }
};

apoyo.verTransf = function(){

    var data = apoyo.elem;
    var proveedor= document.getElementById("proveedor").value;
    var firma= document.getElementById("firma_transf");
    var tipo= document.getElementById("tipo_transf");
    var mostrar= document.getElementById("mostrar_transf");
    var referencia= document.getElementById("referencia_apoyo").value;
    var folio= document.getElementById("folio_apoyo").value;
    var evento= document.getElementById("evento");
    var abono= document.getElementById("abono").value;
    var concepto= document.getElementById("concepto").value;
    
    if(!proveedor) proveedor = document.getElementById("donatario").value;
    

    var tipo= tipo.options[tipo.selectedIndex].text;
    var mostrar= mostrar.options[mostrar.selectedIndex].text;
    var firma= firma.options[firma.selectedIndex].text;
    var abono= data.abono.val();
    if(abono) abono= abono; else abono = 0.00;

    
    var cuenta=null;
    var banco=null;
    var sucursal=null;
    var plaza=null;

    $.ajax({
        type: "POST",
        url: "ajax.php",
        data: {
            action: "getProveedor",
            id_proveedor : proveedor
        },
        success: function(result){
            var res = JSON.parse(result);
            
            cuenta= res.cuenta;
            banco= res.banco;
            sucursal= res.sucursal;
            plaza= res.plaza;
            proveedor = res.razon_social;
            concepto = res.concepto;

            setTimeout(window.open('index.php?op=solicitud&plaza='+plaza+'&sucursal='+sucursal+'&banco='+banco+'&cuenta='+cuenta+'&proveedor='+proveedor+'&firma='+firma+'&tipo='+tipo+'&mostrar='+mostrar+'&referencia='+referencia+'&folio='+folio+'&abono='+abono+'&concepto='+concepto,'_blank'), 3000);

        }
    });
};

apoyo.verCheque = function(){

    var nombre= document.getElementById("proveedor");
    var abono= document.getElementById("abono").value;
    var concepto= document.getElementById("concepto").value;
    var descripcion= document.getElementById("observaciones").value;
 if(!abono) abono = 0.00;
    nombre = nombre.options[nombre.selectedIndex].text;

    
    window.open('index.php?op=cheque&abono='+abono+'&concepto='+concepto+'&nombre='+nombre+'&descripcion='+descripcion,'_blank');
};
