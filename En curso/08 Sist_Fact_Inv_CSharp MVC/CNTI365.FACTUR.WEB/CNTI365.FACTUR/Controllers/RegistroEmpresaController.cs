﻿using CNTI.FACTUR.ENTITY.Encrypt;
using CNTI.FACTUR.ENTITY.Parametros;
using CNTI365.FACTUR.BUSINESS;
using CNTI365.FACTUR.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CNTI365.FACTUR.Controllers {
    public class RegistroEmpresaController : Controller {
        private modelList model;
        private BUPais bupais;
        private BURegistroEmpresa buregistroempresa;
        public RegistroEmpresaController() {
            model=new modelList();
            bupais=new BUPais();
            buregistroempresa=new BURegistroEmpresa();
        }

        public ActionResult RegistroEmpresa(ENRegistroEmpresa paramss) {
            string token = "";
            model.listPais = bupais.listarPaises(paramss, token);
            model.listMoneda =bupais.listarMoneda(paramss, token);
            model.listTImpuesto=bupais.listarTImpuestos(paramss, token);
            model.listPImpuestos=bupais.listarPImpuestos(paramss, token);
            return View(model);
        }

        [AllowAnonymous]
        [HttpPost]
        public ActionResult validarRegistro(ENRegistroEmpresa paramss) {
            string token = "";
            var rpt = buregistroempresa.validarRegistro(paramss, token);
            return Json(new { dt = rpt });
        }

        [HttpPost]
        public ActionResult insertarEmpresa(HttpPostedFileBase file, string razonsocial, string ruc, string email, int idpais, int idmoneda, 
                                            string direccion, int idimpuesto, int idporcentaje, int vendeimpuesto,string username,
                                            string usuario, string contraseña){
            try {
                var clave = Encrypt.GetSHA256(contraseña);
                var filename = "";

                if (file!=null) {
                    string path = Server.MapPath("~/Content/img/img_empresas" + ruc + "/");
                    string filePath = string.Empty;

                    if (!Directory.Exists(path)) {
                        Directory.CreateDirectory(path);
                    }

                    filePath=path+Path.GetFileName(file.FileName);
                    file.SaveAs(filePath);
                    filename=file.FileName;
                }

                var paramss = new ENRegistroEmpresa();
                paramss.razonsocial = razonsocial;
                paramss.ruc = ruc;
                paramss.email=email;
                paramss.idpais=idpais;
                paramss.idmoneda=idmoneda;
                paramss.direccion=direccion;
                paramss.idimpuesto=idimpuesto;
                paramss.idporcentaje=idporcentaje;
                paramss.vendeimpuestos=vendeimpuesto;
                paramss.username=username;
                paramss.usuario=usuario;
                paramss.contraseña=clave;
                paramss.cantuser=1;
                paramss.cargo="superadmin";
                paramss.filename=filename;
                paramss.proyecto="FACTURA";

                string token = "";

                var rpt = buregistroempresa.insertarEmpresa(paramss, token);

                return Json(new {dt = rpt });
            } catch (Exception ex) {

                throw ex;
            }
        }
    }
}
