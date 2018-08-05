
// $(document).ready();
$(function() {
    $(".formulario").submit(function(e){
        return false;
    });
});

var utilerias = {};

utilerias.displaySuccessMessage = function (element, message) {
    $(".alert").remove();
    var div = ("<div class='alert alert-success'>"+message+"</div>");
    element.append(div);
    element.show();
};

utilerias.displayErrorServerMessage = function(element,message){
	$(".alert").remove();
    var div = ("<div class='alert alert-danger'>"+message+"</div>");
    element.append(div);
    element.show();
}

utilerias.displayErrorMessage = function(element, message) {
    var input = element.parent(); // obtiene el contenedor del input
    input.addClass("has-error");
    if(typeof message !== "undefined") {
        var error = $("<span class='help-inline text-danger'>"+message+"</span>");
        input.append(error);
    }
};

utilerias.removeErrorMessages = function () {
    $(".input").removeClass("has-error");
    $(":input,select").parent().removeClass("has-error");
    $(".help-inline").remove();
    $("#mensajes-server").hide();
};

/**
* Valida un formato de fecha YYYY-MM-DD
* No se verifica fecha válida
**/
utilerias.isValidDate = function(date){
    return  /^(19|20|21)[0-9]{2}[\- \/.](0[1-9]|1[012])[\- \/.](0[1-9]|[12][0-9]|3[01])$/.test(date);
};


