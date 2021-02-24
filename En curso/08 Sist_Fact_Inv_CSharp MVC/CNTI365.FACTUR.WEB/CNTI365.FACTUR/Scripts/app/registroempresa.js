﻿$(document).ready(function () {
    document.getElementById("rdsi").checked = true;
    $("#divvendeImpuestos").show();
})

/*visualizar imagen*/
$("#imagen").change(function () {
    let imagen = this.files[0];

    if (imagen["type"] != "image/jpeg" && imagen["type"] != "image/png") {
        $("#imagen").val("");
        $(".previsualizar").attr("src", "../Content/img/img_logo/TuLogo.png");
        alert("Debe subir una imagen en formato jpeg o png");
    } else if (imagen["size"] > 2000000) {
        $("#imagen").val("");
        $(".previsualizar").attr("src", "../Content/img/img_logo/TuLogo.png");
        alert("La imagen debe tener como maximo 2MB");
    } else {
        var datosImagen = new FileReader;
        datosImagen.readAsDataURL(imagen);

        $(datosImagen).on("load", function (event) {
            var rutaImagen = event.target.result;
            $(".previsualizar").attr("src", rutaImagen);
        })
    }
})

$("#rdsi").on("click", function () {
    document.getElementById("rdno").checked = false;
    document.getElementById("rdsi").checked = true;
    $("#divvendeImpuestos").show();
})

$("#rdno").on("click", function () {
    document.getElementById("rdno").checked = true;
    document.getElementById("rdsi").checked = false;
    $("#divvendeImpuestos").hide();
})

$("#btnsiguiente").on("click", function () {
    console.log("boton siguiente");
    let razonsocial = $("#txtrazonsocial").val();
    let ruc = $("#txtruc").val();
    let email = $("#txtemail").val();

    if (razonsocial.trim() == "") {
        $("#msjrazonsocial").html("*El campo razon social no debe estar vacio").css("color", "red");
        $("#txtrazonsocial").css("border-color", "red");
        $("#txtrazonsocial").focus();
    } else if (ruc.trim() == "") {
        $("#msjruc").html("*El campo ruc no debe estar vacio").css("color", "red");
        $("#txtruc").css("border-color", "red");
        $("#txtruc").focus();
    } else if (email.trim() == "") {
        $("#msjemail").html("*El campo email no debe estar vacio").css("color", "red");
        $("#txtemail").css("border-color", "red");
        $("#txtemail").focus();
    } else if (!validaEmail(email)) {
        $("#msjemail").html("*Debe ingresar un email valido").css("color", "red");
        $("#txtemail").css("border-color", "");
    } else {

        var paramss = new Object();
        paramss.razonsocial = razonsocial;
        paramss.ruc = ruc;
        paramss.email = email;

        Post("RegistroEmpresa/validarRegistro", paramss).done(function (datos) {
            if (datos.dt.response == "ok") {
                $(".divregistroempresa").hide();
                $(".divregistrousersuperadmin").show();
                document.getElementById("btnregistrar").disabled = true;
            } else {
                swal({
                    position: "top-end",
                    type: "error",
                    title: datos.dt.response,
                    text: 'por favor valide el campo solicitado',
                    showConfirmButton: true,
                    timer: 60000,
                    confirmButtonText: 'Cerrar'
                })
            }
        })
    }
})

$("#txtrazonsocial").keyup(function () {
    let razonsocial = $("#txtrazonsocial").val();
    if (razonsocial == "") {
        $("#msjrazonsocial").html("*El campo razon social no debe estar vacio").css("color", "red");
        $("#txtrazonsocial").css("border-color", "red");
    } else {
        $("#msjrazonsocial").html("").css("color", "red");
        $("#txtrazonsocial").css("border-color", "");
    }
})

$("#txtruc").keyup(function () {
    let ruc = $("#txtruc").val();
    if (ruc == "") {
        $("#msjruc").html("*El campo ruc no debe estar vacio").css("color", "red");
        $("#txtruc").css("border-color", "red");
    } else {
        $("#msjruc").html("").css("color", "red");
        $("#txtruc").css("border-color", "");
    }
})

$("#txtemail").keyup(function () {
    let email = $("#txtemail").val();
    if (email == "") {
        $("#msjemail").html("*El campo email no debe estar vacio").css("color", "red");
        $("#txtemail").css("border-color", "red");
    } else {
        console.log("error");
        if (!validaEmail(email)) {
            $("#msjemail").html("*Debe ingresar un email valido").css("color", "red");
            $("#txtemail").css("border-color", "");
        } else {
            $("#msjemail").html("").css("color", "red");
            $("#txtemail").css("border-color", "");
        }
    }
})

$("#btnregistrar").on("click", function () {
    let razonsocial = $("#txtrazonsocial").val();
    let ruc = $("#txtruc").val();
    let email = $("#txtemail").val();
    let idpais = $("#slpais").val();
    let idmoneda = $("#slmoneda").val();
    let direccion = $("#txtdireccion").val();

    let idimpuesto = 0;
    let idporcentaje = 0;
    let vendeimpuesto = 0;

    let username = $("#txtusername").val();
    let usuario = $("#txtusuario").val();
    let contraseña = $("#txtcontraseña").val();
    let confircontraseña = $("#txtconfircontraseña").val();

    if ($("#rdsi").is(":checked") == true) {
        idimpmuesto = $("#sltipoimpuesto").val();
        idporcentaje = $("#slporcentaje").val();
        vendeimpuesto = 1;
    }

    if (username == "") {
        $("#msjusername").html("*El campo nombre de administrador no debe estar vacio").css("color", "red")
        $("#txtusername").css("border-color", "red");
        $("#txtusername").focus();
    } else if (usuario == "") {
        $("#msjusuario").html("*El campo usuario no debe estar vacio").css("color", "red")
        $("#txtusuario").css("border-color", "red");
        $("#txtusuario").focus();
    } else if (contraseña == "") {
        $("#msjpassword").html("*El campo contraseña no debe estar vacio").css("color", "red")
        $("#txtcontraseña").css("border-color", "red");
        $("#txtcontraseña").focus();
    } else if (confircontraseña == "") {
        $("#msjconfirpassword").html("*El campo confirmar contraseña no debe estar vacio").css("color", "red")
        $("#txtconfircontraseña").css("border-color", "red");
        $("#txtconfircontraseña").focus();
    } else {
        let params = new FormData();
        let slfile = ($("#imagen"))[0].files[0];
        params.append("file", slfile);
        params.append("razonsocial", razonsocial);
        params.append("ruc", ruc);
        params.append("email", email);
        params.append("idpais", idpais);
        params.append("idmoneda", idmoneda);
        params.append("direccion", direccion);
        params.append("idimpuesto", idimpuesto);
        params.append("idporcentaje", idporcentaje);
        params.append("vendeimpuesto", vendeimpuesto);
        params.append("username", username);
        params.append("usuario", usuario);
        params.append("contraseña", contraseña);

        PostImg("RegistroEmpresa/insertarEmpresa", params).done(function (datos) {
            if (datos.dt.response == "ok") {
                swal({
                    position: 'top-end',
                    type: 'success',
                    title: datos.dt.msj,
                    text: datos.dt.text,
                    showConfirmButton: true,
                    timer: 60000,
                    confirmButtonText: 'Cerrar'
                }).then((result) => {
                    if (result.value) {
                        window.location = fnBaseURLWeb("Home/Index");
                    } else {
                        window.location = fnBaseURLWeb("Home/Index");
                    }
                })
            } else {
                swal({
                    position: 'top-end',
                    type: 'error',
                    title: datos.dt.msj,
                    text: datos.dt.text,
                    showConfirmButton: true,
                    timer: 60000,
                    confirmButtonText: 'Cerrar'
                })
            }
        })
    }
})