/**
 * @author: desarrollo web
 */
(function () {
    'use strict';

    angular.module('appRTA')
        .controller('cotGestionPedidos', cotGestionPedidos);

    cotGestionPedidos.$inject = ['parametrosService', '$scope', 'configService', 'loginService', '$timeout', '$location', '$cookieStore', '$rootScope', '$uibModal', 'RTAService', 'modalService', '$constants'];

    function cotGestionPedidos(parametrosService, $scope, configService, loginService, $timeout, $location, $cookieStore, $rootScope, $uibModal, RTAService, modalService, $constants) {
        var vm = $scope;
        
        function init() {

            //GALES

            vm.getCotizacionesByUsusario = getCotizacionesByUsusario,

              vm.cambiarEstadoPedido = cambiarEstadoPedido;


            vm.istaCotizacionesUsuario = [];

            function getCotizacionesByUsusario() {
                vm.listaCotizacionesUsuario = [];
                vm.objectDialog.LoadingDialog("...");

                RTAService.getCotizacionesByUsusario(loginService.UserData.ID_USUARIO)
                    .then(function (data) {
                        vm.objectDialog.HideDialog();

                        if (data.data.length > 0 && data.data[0].length > 0) {
                            vm.listaCotizacionesUsuario = data.data[0];

                            vm.listaCotizacionesUsuario.forEach((item) => {
                                item.FECHA_COTIZACION_FORMAT = moment(item.FECHA_COTIZACION).format("DD-MMMM-YYYY");
                            });

                        } else {
                            toastr.warning("No se encontró ninguna cotización realizada por el usuario" + loginService.UserData.NOMBRES_USUARIO + ' ' + loginService.UserData.APELLIDOS_USUARIO);
                            vm.listaCotizacionesUsuario = [];
                        }
                    });
            }

            getCotizacionesByUsusario();

            function cambiarEstadoPedido(item) {

                var csIdCotizacion = item.CS_ID_COTIZACION;
                var estado = item.ESTADO_COTIZACION
                if (estado === 1) {
                    swal("EL PEDIDO SE ENCUENTRA HABILITADO", "", "info");
                    return;
                }

                if (loginService.UserData.PERFIL_USUARIO !== 1) {
                    swal("El usuario no tiene persimos para habilitar el pedido", "", "info");
                    return;

                }

                let text_confirm = "Está seguro de habilitar el pedido ?";
                modalService.modalFormConfirmacion(text_confirm)
                    .then(() => {

                        let request = {
                            CS_H_COTIZACION: csIdCotizacion,
                            ESTADO_COTIZACION: 1, //cerrado
                            ID_USUARIO: loginService.UserData.ID_USUARIO
                        };

                        vm.objectDialog.LoadingDialog("...");
                        RTAService.updateEstadoHCotizaciones(request)
                            .then(function (result) {

                                vm.objectDialog.HideDialog();

                                if (result.MSG === "OK") {
                                    swal("PEDIDO HABILITADO CORRECTAMENTE.", "", "success");
                                    getCotizacionesByUsusario();
                                } else {
                                    console.error(result.MSG);
                                    toastr.error(result.MSG);
                                }
                            });
                    });
            }




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
                        vm.obj_encabezado_cotizacion.fecha_cotizacion = cotizacion.FECHA_COTIZACION;
                    
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

                let text_confirm = "Está seguro de cerrar el pedido?";
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
                                    swal("PEDIDO CERRADO CORRECTAMENTE.", "", "success");
                                    limpiar_formulario();
                                } else {
                                    console.error(result.MSG);
                                    toastr.error(result.MSG);
                                }
                            });
                    });
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

           
     

     

           

            
        };
      
        
        //#region Control User Session
        
        vm.cookieUser = {};
        vm.cookieUser = $cookieStore.get('servlog');

        if (!_.isNull(vm.cookieUser)) {
            if (vm.cookieUser.hasSession && parseInt(vm.cookieUser.UserData.ID_USUARIO) === parseInt(loginService.UserData.ID_USUARIO)) {
                if ($location.$$path == "/cotGestionPedidos" && angular.verficar_perfil_usuario("cotGestionPedidos")) {

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

