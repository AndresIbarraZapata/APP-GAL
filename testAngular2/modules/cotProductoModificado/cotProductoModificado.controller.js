/**
 * @author: desarrollo web
 */
(function () {
    'use strict';

    angular.module('appRTA')
        .controller('cotProductoModificado', cotProductoModificado);

    cotProductoModificado.$inject = ['parametrosService', '$scope', 'configService', 'loginService', '$timeout', '$location', '$cookieStore', '$rootScope', '$uibModal', 'RTAService', 'modalService', '$constants'];

    function cotProductoModificado(parametrosService, $scope, configService, loginService, $timeout, $location, $cookieStore, $rootScope, $uibModal, RTAService, modalService, $constants) {
        var vm = $scope;

        function init() {

            vm.show_modal_seleccion_proyecto = show_modal_seleccion_proyecto;
            vm.agregar_producto_destino = agregar_producto_destino;
            vm.remover_producto_destino = remover_producto_destino;
            vm.remover_producto_origen = remover_producto_origen;
            vm.editar_producto_destino = editar_producto_destino;
            vm.ver_detalle_item_cot = ver_detalle_item_cot;

            vm.list_productos_seleccionados = [];

            vm.dominio = configService.variables.Dominio;

            vm.list_productos_destino = [];
            
            function limpiar_formulario() {

                vm.list_productos_seleccionados = [];
                vm.list_productos_destino = [];
                $timeout(() => {
                    vm.$apply();
                }, 0);
            }

            function agregar_producto_destino() {

                vm.list_productos_destino = angular.copy(vm.list_productos_seleccionados);

                vm.list_productos_destino.forEach((item) => {
                    item.ID_ITEM = "";
                    item.ID_REFERENCIA = "";
                    item.DESCRIPCION = "";
                });

                $timeout(() => {
                    vm.$apply();
                }, 0);
            }

            function remover_producto_origen() {

                vm.list_productos_seleccionados = [];
                $timeout(() => {
                    vm.$apply();
                }, 0);

            }

            function remover_producto_destino() {

                vm.list_productos_destino = [];
                $timeout(() => {
                    vm.$apply();
                }, 0);

            }

            function ver_detalle_item_cot(producto) {
                modalService.modalFormDetalleProducto(producto);
            }

            function editar_producto_destino(producto) {
                
                if (!producto.ID_ITEM || producto.ID_ITEM === "") {
                    toastr.warning("Debe ingresar un código de producto válido.");
                    return;
                }

                if (!producto.ID_REFERENCIA || producto.ID_REFERENCIA === "") {
                    toastr.warning("Debe ingresar una referencia de producto válida.");
                    return;
                }

                if (!producto.DESCRIPCION || producto.DESCRIPCION === "") {
                    toastr.warning("Debe ingresar una descripción de producto válida.");
                    return;
                }

                producto.ID_ITEM = producto.ID_ITEM.toUpperCase();
                producto.ID_REFERENCIA = producto.ID_REFERENCIA.toUpperCase();
                producto.DESCRIPCION = producto.DESCRIPCION.toUpperCase();

                modalService.modalFormDetalleProductoModificacionInsumos(producto)
                    .then(() => {
                        limpiar_formulario();
                    });

                //modalService.modalFormEditarItemCot(angular.copy(item))
                //    .then((producto) => {
                //        guardar_edicion_producto_seleccionado(producto);
                //    });
            }

            function show_modal_seleccion_proyecto() {

                modalService.modalFormBusquedaProyectos(vm.list_productos_seleccionados)
                    .then((producto) => {

                        vm.list_productos_seleccionados = [];
                        vm.list_productos_seleccionados.push(producto);

                        vm.list_productos_destino = [];
                        $timeout(() => {
                            vm.$apply();
                        }, 0);

                        angular.activarFancybox();
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


                            angular.activarFancybox();
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
        };

        //#region Control User Session

        vm.cookieUser = {};
        vm.cookieUser = $cookieStore.get('servlog');

        if (!_.isNull(vm.cookieUser)) {
            if (vm.cookieUser.hasSession && parseInt(vm.cookieUser.UserData.ID_USUARIO) === parseInt(loginService.UserData.ID_USUARIO)) {
                if ($location.$$path == "/cotProductoModificado" && angular.verficar_perfil_usuario("cotProductoModificado")) {

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

