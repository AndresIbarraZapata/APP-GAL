﻿/**
 * @author: desarrollo web
 */
(function () {
    'use strict';

    angular.module('appRTA')
           .controller('cotProductoDesarrollado', cotProductoDesarrollado);

    cotProductoDesarrollado.$inject = ['parametrosService', '$scope', 'configService', 'loginService', '$timeout', '$location', '$cookieStore', '$rootScope', '$uibModal', 'RTAService', 'modalService', '$constants'];

    function cotProductoDesarrollado(parametrosService, $scope, configService, loginService, $timeout, $location, $cookieStore, $rootScope, $uibModal, RTAService, modalService, $constants) {
        var vm = $scope;
        
        function init() {

            //GALES
            vm.getInformacioncliente = getInformacioncliente,

            vm.show_modal_seleccion_proyecto = show_modal_seleccion_proyecto;
            vm.remover_producto              = remover_producto;
            vm.guardar                       = guardar;
            vm.ver_modal_cotizaciones        = ver_modal_cotizaciones;
            vm.generarConsecutivoCotizacion  = generarConsecutivoCotizacion;
            vm.limpiar_formulario = limpiar_formulario;
            vm.totalizar_producto = totalizar_producto;
            vm.editar_producto               = editar_producto;
            vm.cerrar_cotizacion             = cerrar_cotizacion;
            vm.ver_detalle_item_cot          = ver_detalle_item_cot; 

            vm.swMostrarItems = false;

            vm.list_productos_seleccionados = [];

            vm.obj_encabezado_cotizacion = {
                cs_cotizacion:"",
                nombre_cliente: "",
                documento_cliente: "",
                codigo_cliente: "",
                establecimiento: "",
                nombre_vendedor: "",
                codigo_vendedor:"",
                dias_vencimiento: "",
                c_forma_pago: "",
                d_forma_pago:"",
                fecha_cotizacion: "",
                cs_id_usuario: loginService.UserData.ID_USUARIO,
                cs_cotizacion: null,
                ESTADO_COTIZACION: 1,
                estado_cartera: "",
                tipo_cotizacion: "PW",
                correo_cliente: "",
                cs_h_cotizacion:""
            };

            vm.swMostrarItems = false;

            
            vm.listaCotizacionesUsuario         = [];
            vm.listaDetalleCotizacion           = [];
            vm.listaMaterialesByItemCotizacion  = [];

            vm.dominio = configService.variables.Dominio;

            $timeout(function() {
                $("#dpFechaCotizacion").datetimepicker({
                    dayViewHeaderFormat: "MMMM YYYY",
                    locale: "es",
                    //sideBySide: true,
                    //minDate: moment(),
                    defaultDate: moment(),
                    showClear: true,
                    widgetPositioning: {
                        horizontal: "left",
                        vertical: "bottom"
                    },
                    format: "DD/MMMM/YYYY"
                });

                $timeout(function() {
                    $("[class*=date]").on("keypress", function(e) { e.preventDefault(); });
                }, 50);

            }, 300);

            vm.obj_totales = {
                pj_descuento: 0,
                vr_descuento: 0,
                total: 0
            };


            //GALES

            function totalizar_producto() {

                vm.obj_totales.total = 0;
                vm.obj_totales.vr_descuento = 0;

                vm.list_productos_seleccionados.forEach((item) => {
                    vm.obj_totales.total = vm.obj_totales.total  + (item.VALOR);
                });

                vm.obj_totales.vr_descuento = vm.obj_totales.total * ((vm.obj_totales.pj_descuento || 0) / 100);

                vm.obj_totales.total = vm.obj_totales.total - vm.obj_totales.vr_descuento;
            }

            function getInformacioncliente() {

                if (vm.obj_encabezado_cotizacion.codigo_cliente === "") {
                    toastr.info("Debe ingresar un documento del cliente");
                    return;
                }
                    
                vm.objectDialog.LoadingDialog("...");

                RTAService.getInformacioncliente(vm.obj_encabezado_cotizacion.codigo_cliente)
                    .then(function (data) {
                        vm.objectDialog.HideDialog();

                        if (data.data.length > 0 && data.data[0].length > 0) {

                            let listaCliente=[];

                            listaCliente = data.data[1]
                            listaCliente.forEach((item) => {
                                if (item.DIAS_VENCIMIENTO_CARTERA > 0) {
                                    vm.obj_encabezado_cotizacion.estado_cartera = 'VENCIDA';
                                } else {
                                    vm.obj_encabezado_cotizacion.estado_cartera = 'SIN VENCER';
                                }
                            })


                            vm.obj_encabezado_cotizacion.documento_cliente = data.data[0][0].CODIGO_CLIENTE;
                            vm.obj_encabezado_cotizacion.nombre_cliente = data.data[0][0].NOMBRE_CLIENTE;
                            vm.obj_encabezado_cotizacion.establecimiento = data.data[0][0].ESTABLECIMIENTO;
                            vm.obj_encabezado_cotizacion.nombre_vendedor = data.data[0][0].VENDEDOR;
                            vm.obj_encabezado_cotizacion.codigo_vendedor = data.data[0][0].CODIGO_VENDEDOR;
                            vm.obj_encabezado_cotizacion.dias_vencimiento = data.data[1][0].DIAS_VENCIMIENTO_CARTERA;
                            vm.obj_encabezado_cotizacion.c_forma_pago = data.data[0][0].C_FORMA_PAGO;
                            vm.obj_encabezado_cotizacion.d_forma_pago = data.data[0][0].D_FORMA_PAGO;
                            vm.obj_encabezado_cotizacion.correo_cliente = data.data[0][0].EMAIL;
                            

                        } else {
                            toastr.info("No se encontró informacion del cliente con el documento ingresado");
               
                        }
                    });
            }

            function generarConsecutivoCotizacion() {

                if (vm.obj_encabezado_cotizacion.documento_cliente === null ||
                    vm.obj_encabezado_cotizacion.documento_cliente === undefined ||
                    vm.obj_encabezado_cotizacion.documento_cliente === "") {
                    toastr.warning("Debe ingresar un documento de cliente");
                    return;
                }


                let fecha_ct = $('#dpFechaCotizacion').data("DateTimePicker").date();
                vm.obj_encabezado_cotizacion.fecha_cotizacion = fecha_ct == null ? null : moment(fecha_ct).format("YYYY-MM-DD");

                if (vm.obj_encabezado_cotizacion.fecha_cotizacion === "" || vm.obj_encabezado_cotizacion.fecha_cotizacion === null) {
                    toastr.warning('Debe soleccionar una fecha');
                    return;
                };


                if (vm.obj_encabezado_cotizacion.cs_cotizacion !== undefined &&
                    vm.obj_encabezado_cotizacion.cs_cotizacion !== null &&
                    vm.obj_encabezado_cotizacion.cs_cotizacion !== 0) {

                    vm.swMostrarItems = true;

                } else {
                    vm.objectDialog.LoadingDialog("...");
                    console.log(vm.obj_encabezado_cotizacion);

                    RTAService.generarConsecutivoCotizacion(vm.obj_encabezado_cotizacion.tipo_cotizacion, vm.obj_encabezado_cotizacion.cs_id_usuario)
                        .then(function (result) {

                            vm.objectDialog.HideDialog();

                            if (result.MSG === "OK") {
                                vm.obj_encabezado_cotizacion.cs_cotizacion = result.OUT_CS_COTIZACION;

                                vm.insertEncabezadoCotizacion();
                            }
                            else {
                                toastr.error(result.MSG);
                            }

                        });
                }
            };



            vm.insertEncabezadoCotizacion = function () {
                RTAService.insertEncabezadoCotizacion(vm.obj_encabezado_cotizacion)
                    .then(function (result) {

                        if (result.MSG === "OK") {
                            swal("SE HA INICIADO LA COTIZACIÓN CORRECTAMENTE", "", "success");
                            vm.swMostrarItems = true;
                            vm.obj_encabezado_cotizacion.cs_h_cotizacion = result.OUT_CS_H_COTIZACION;
                        }
                        else {
                            console.log(result.MSG);
                        }
                    });
            };


            function ver_modal_cotizaciones() {

                modalService.modalFormBuscarCotizaciones()
                    .then((cotizacion) => {
                        console.log("dt_cotizacion", cotizacion);
                        limpiar_formulario();

                 
                          if (cotizacion.DIAS_VENCIMIENTO_CARTERA > 0) {
                                vm.obj_encabezado_cotizacion.estado_cartera = 'VENCIDA';
                            } else {
                                vm.obj_encabezado_cotizacion.estado_cartera = 'SIN VENCER';
                            }
                        

                        vm.obj_encabezado_cotizacion.codigo_cliente = cotizacion.DOCUMENTO_CLIENTE;

                        vm.obj_encabezado_cotizacion.documento_cliente = cotizacion.DOCUMENTO_CLIENTE;
                        vm.obj_encabezado_cotizacion.nombre_cliente = cotizacion.NOMBRES_CLIENTE;
                        vm.obj_encabezado_cotizacion.establecimiento = cotizacion.ESTABLECIMIENTO;
                        vm.obj_encabezado_cotizacion.nombre_vendedor = cotizacion.VENDEDOR;
                        vm.obj_encabezado_cotizacion.codigo_vendedor = cotizacion.CODIGO_VENDEDOR;
                        vm.obj_encabezado_cotizacion.dias_vencimiento = cotizacion.DIAS_VENCIMIENTO_CARTERA;
                        vm.obj_encabezado_cotizacion.c_forma_pago = cotizacion.FORMA_PAGO;
                        vm.obj_encabezado_cotizacion.d_forma_pago = cotizacion.D_FORMA_PAGO;
                        vm.obj_encabezado_cotizacion.correo_cliente = cotizacion.EMAIL_CLIENTE;
                    
                        $('#dpFechaCotizacion').data("DateTimePicker").date(moment(cotizacion.FECHA_COTIZACION));

                        vm.obj_encabezado_cotizacion.tipo_cotizacion = cotizacion.TIPO_COTIZACION;
                        vm.obj_encabezado_cotizacion.cs_cotizacion = cotizacion.CS_TIPO_COTIZACION;
                        vm.obj_encabezado_cotizacion.cs_h_cotizacion = cotizacion.CS_ID_COTIZACION;
                        vm.obj_encabezado_cotizacion.ESTADO_COTIZACION = cotizacion.ESTADO_COTIZACION;

                        

                        if (cotizacion.listaDetalleCotizacion.length > 0) {
                            vm.list_productos_seleccionados = cotizacion.listaDetalleCotizacion;
                            vm.swMostrarItems = true;
                            angular.activarFancybox();
                            totalizar_producto();
                        }

                        $timeout(() => {
                            vm.$apply();
                        }, 0);
                    });
            }


            function cerrar_cotizacion() {

                let text_confirm = "Está seguro de cerrar la cotización?";
                modalService.modalFormConfirmacion(text_confirm)
                    .then(() => {

                        let request = {
                            CS_H_COTIZACION: vm.obj_encabezado_cotizacion.cs_h_cotizacion,
                            ESTADO_COTIZACION: 2, //cerrado
                            ID_USUARIO: loginService.UserData.ID_USUARIO
                        };

                        vm.objectDialog.LoadingDialog("...");
                        RTAService.updateEstadoHCotizaciones(request)
                            .then(function (result) {

                                vm.objectDialog.HideDialog();

                                if (result.MSG === "OK") {
                                    swal("COTIZACIÓN CERRADA CORRECTAMENTE.", "", "success");
                                    limpiar_formulario();
                                } else {
                                    console.error(result.MSG);
                                    toastr.error(result.MSG);
                                }
                            });
                    });
            }

            function guardar_producto_seleccionado(producto) {

                producto.CS_H_COTIZACION = vm.obj_encabezado_cotizacion.cs_h_cotizacion;
                producto.ID_USUARIO = loginService.UserData.ID_USUARIO;

                vm.objectDialog.LoadingDialog("...");
                RTAService.insertProductosCotizacion(producto)
                    .then(function (result) {

                        vm.objectDialog.HideDialog();

                        if (result.MSG === "OK") {
                            toastr.success("Producto Agregado Correctamente.");
                            producto.CS_ID_DT_COTIZACION = result.OUT_CS_ID_DT_COTIZACION;
                            vm.list_productos_seleccionados.push(producto);
                            

                            angular.activarFancybox();
                            totalizar_producto();

                        } else {
                            console.error(result.MSG);
                            toastr.error("Ocurrió un error al tratar de insertar el producto, intentelo nuevamente.");
                        }
                    });
            }

            $("[id$=myButtonControlID]").click(function (e) {
                window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('div[id$=divTableDataHolder]').html()));
                e.preventDefault();
            });
            function limpiar_formulario() {
                vm.obj_encabezado_cotizacion.documento_cliente = "";
                vm.obj_encabezado_cotizacion.codigo_cliente = "";
                vm.obj_encabezado_cotizacion.nombre_cliente = "";
                vm.obj_encabezado_cotizacion.nombre_vendedor = "";
                vm.obj_encabezado_cotizacion.codigo_vendedor = "";
                vm.obj_encabezado_cotizacion.dias_vencimiento = "";
                vm.obj_encabezado_cotizacion.c_forma_pago = "";
                vm.obj_encabezado_cotizacion.d_forma_pago = "";
                vm.obj_encabezado_cotizacion.establecimiento = "";
                vm.obj_encabezado_cotizacion.estado_cartera = "";
                vm.obj_encabezado_cotizacion.cs_cotizacion = null;
                vm.obj_encabezado_cotizacion.cs_h_cotizacion = null;
                vm.list_productos_seleccionados = [];
                vm.swMostrarItems = false;
                vm.obj_encabezado_cotizacion.ESTADO_COTIZACION = 1;

                $('#dpFechaCotizacion').data("DateTimePicker").date(moment());


                $timeout(() => {
                    vm.$apply();
                }, 0);
            }
    




            function ver_detalle_item_cot(item) {
                modalService.modalFormDetalleItemCot(item);
            }

          

            function editar_producto(item) {
                modalService.modalFormEditarItemCot(angular.copy(item))
                .then((producto) => {
                      guardar_edicion_producto_seleccionado(producto);
                });
            }

           
            function guardar() {
                //let template_evaluacion = null;

                //var elem = document.getElementById("evaluacion_empl");
                //var domClone = elem.cloneNode(true);

                //var $printSection = document.getElementById("printSection");

                //if (!$printSection) {
                //    $printSection = document.createElement("div");
                //    $printSection.id = "printSection";
                //    document.body.appendChild($printSection);
                //} else {
                //    document.getElementById("printSection").remove();
                //    $printSection = document.createElement("div");
                //    $printSection.id = "printSection";
                //    document.body.appendChild($printSection);
                //}

                //$printSection.appendChild(domClone);

                ////clonamos el div, y eliminamos los input, se envia el resultado a la API
                //var htmlTemp = $("#printSection");
                ////htmlTemp.find("input").remove();
                //htmlTemp.find("div.ng-hide").remove();
                //htmlTemp.find("i.ng-hide").remove();
                //htmlTemp.find("span.ng-hide").remove();

                ////htmlTemp.find("#bootstrap").attr('href', 'http://192.168.1.43//EvaluacionDesempenio/Assets/VendorReferences/Bootstrap/css/bootstrap.css');
                ////htmlTemp.find("#app_styles").attr('href', 'http://192.168.1.43//EvaluacionDesempenio/Assets/Css/estilos_pdf_file.css');

                ////obtenemos el innerHTML del elemento clonado
                //template_evaluacion = htmlTemp.html();

            }

            function show_modal_seleccion_proyecto() {

                if (vm.list_productos_seleccionados.length > 24) {
                    toastr.info("Señor usuario, ya se cumplió con el tope de registros ára este pedido, para agregar nuevos productos inicie un nuevo documento");
                    return;
                }

                modalService.modalFormAddNuevoProyecto(vm.list_productos_seleccionados)
                    .then((producto) => {
                        guardar_producto_seleccionado(producto);
                    });
            }

           

            function guardar_edicion_producto_seleccionado(producto) {

                producto.CS_H_COTIZACION = vm.obj_encabezado_cotizacion.cs_h_cotizacion;
                producto.ID_USUARIO = loginService.UserData.ID_USUARIO;
                producto.CS_ID_DT_COTIZACION = producto.CS_ID_DT_COTIZACION;

                vm.objectDialog.LoadingDialog("...");
                RTAService.editarProductoDtCotizacion(producto)
                    .then(function (result) {

                        vm.objectDialog.HideDialog();

                        if (result.MSG === "OK") {
                            toastr.success("Producto Editado Correctamente.");

                            getDetalleCotizacion(producto);

                            angular.activarFancybox();
                        } else {
                            console.error(result.MSG);
                            toastr.error("Ocurrió un error al tratar de insertar el producto, intentelo nuevamente.");
                        }
                    });
            }

            function getDetalleCotizacion(item) {

                vm.list_productos_seleccionados = [];

                let csIdCotizacion = item.CS_ID_COTIZACION;

                vm.objectDialog.LoadingDialog("...");

                RTAService.getDetalleCotizacion(csIdCotizacion)
                   .then(function (data) {
                       vm.objectDialog.HideDialog();

                       if (data.data.length > 0 && data.data[0].length > 0) {
                           vm.listaDetalleCotizacion = data.data[0];

                           vm.list_productos_seleccionados = data.data[0];
                       } else {
                           toastr.warning("No se encontró items asociados a la cotización");
                           vm.list_productos_seleccionados = [];
                       }
                   });
            }

            function remover_producto(producto) {

                let text_confirm = "Está seguro de eliminar el item de la cotización?";
                modalService.modalFormConfirmacion(text_confirm)
                    .then(() => {

                        vm.objectDialog.LoadingDialog("...");
                        RTAService.deleteProductoDtCotizacion(producto)
                            .then(function (result) {

                                vm.objectDialog.HideDialog();
                                if (result.MSG === "OK") {
                                    toastr.success("Producto Eliminado Correctamente.");

                                    let indice_producto = 0;
                                    vm.list_productos_seleccionados.forEach(function(item, index) {
                                        if (item.CS_ID_DT_COTIZACION === producto.CS_ID_DT_COTIZACION)
                                            indice_producto = index;
                                    });

                                    vm.list_productos_seleccionados.splice(indice_producto, 1);
                                } else {
                                    console.error(result.MSG);
                                    toastr.error("Ocurrió un error al tratar de eliminar el producto, intentelo nuevamente.");
                                }
                            });
                    });
            }
            
        };
      
        
        //#region Control User Session
        
        vm.cookieUser = {};
        vm.cookieUser = $cookieStore.get('servlog');

        if (!_.isNull(vm.cookieUser)) {
            if (vm.cookieUser.hasSession && parseInt(vm.cookieUser.UserData.ID_USUARIO) === parseInt(loginService.UserData.ID_USUARIO)) {
                if ($location.$$path == "/cotProductoDesarrollado" && angular.verficar_perfil_usuario("cotProductoDesarrollado")) {

                    angular.VerificarVersionApp();
                    $rootScope.$$childHead.showmodal = false;
                    init();

                } else {
                    loginService.cerrarSesion();
                }
            } else {
                loginService.cerrarSesion();
            }
        } else {
            loginService.cerrarSesion();
        }
        //#endregion
    };
}());
