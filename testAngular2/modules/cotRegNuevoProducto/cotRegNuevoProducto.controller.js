/**
 * @author: desarrollo web
 */
(function () {
    'use strict';

    angular.module('appRTA')
           .controller('cotRegNuevoProducto', cotRegNuevoProducto);

    cotRegNuevoProducto.$inject = ['$upload', 'parametrosService', '$scope', 'configService', 'loginService', '$timeout', '$location', '$cookieStore', '$rootScope', '$uibModal', 'RTAService', 'modalService', '$constants'];

    function cotRegNuevoProducto($upload, parametrosService, $scope, configService, loginService, $timeout, $location, $cookieStore, $rootScope, $uibModal, RTAService, modalService, $constants) {
        var vm = $scope;

        function init() {

            vm.limpiar_formulario = limpiar_formulario;
            vm.show_modal_seleccion_insumo = show_modal_seleccion_insumo;
            vm.eliminar_insumo_adjunto = eliminar_insumo_adjunto;
            vm.guardar_producto = guardar_producto;

            vm.obj_nuevo_producto_original = {
                ID_ITEM: "",
                ID_REFERENCIA: "",
                DESCRIPCION: "",
            };

     
            vm.obj_nuevo_producto = angular.copy(vm.obj_nuevo_producto_original);
            vm.dataInsumosProducto = [];
            vm.dataInsumosProductoSafe = [];
            
            vm.$watch('obj_nuevo_producto.ID_ITEM', function (newValue) {
                if (newValue.length > 6) {
                    toastr.info("El código solo puede ser compuesto por 6 caracteres.");
                    vm.obj_nuevo_producto.ID_ITEM = "";
                }
            });

            function limpiar_formulario() {
  
                vm.obj_nuevo_producto = angular.copy(vm.obj_nuevo_producto_original);
                vm.dataInsumosProducto = [];

                $timeout(() => {
                    vm.$apply();
                }, 0);
            }
            
            function show_modal_seleccion_insumo() {

                modalService.modalFormBusquedaInsumosProducto(vm.dataInsumosProducto)
                    .then((insumo) => {

                        insumo.COSTO_PROM_FINAL_BASE = insumo.COSTO_PROM_FINAL;
                        //insumo.COSTO_PROM_FINAL = parseFloat(insumo.CANTIDAD_REQUERIDA) * parseFloat(insumo.COSTO_PROM_FINAL_BASE);

                        vm.dataInsumosProductoSafe.push(insumo);
                        vm.dataInsumosProducto = [];

                        $timeout(() => {
                                vm.dataInsumosProducto = angular.copy(vm.dataInsumosProductoSafe);
                            }, 300);
                   
                        console.log("insumo", insumo)
                        angular.activarFancybox();
                    });
            }

            function eliminar_insumo_adjunto(insumo) {

                let index_ins = null;
                vm.dataInsumosProductoSafe.forEach((item, index) => {

                    if (item.ID_COD_ITEM_C === insumo.ID_COD_ITEM_C)
                        index_ins = index;
                });

                vm.dataInsumosProductoSafe.splice(index_ins, 1);

                vm.dataInsumosProducto = [];

                $timeout(() => {
                    vm.dataInsumosProducto = angular.copy(vm.dataInsumosProductoSafe);
                }, 300);
            }

            function guardar_producto() {
                
                if (!vm.obj_nuevo_producto.ID_ITEM || vm.obj_nuevo_producto.ID_ITEM === "") {
                    toastr.warning("Debe ingresar un código de producto válido.");
                    return;
                }

                if (!vm.obj_nuevo_producto.ID_REFERENCIA || vm.obj_nuevo_producto.ID_REFERENCIA === "") {
                    toastr.warning("Debe ingresar una referencia de producto válida.");
                    return;
                }

                if (!vm.obj_nuevo_producto.DESCRIPCION || vm.obj_nuevo_producto.DESCRIPCION === "") {
                    toastr.warning("Debe ingresar una descripción de producto válida.");
                    return;
                }

                if (vm.dataInsumosProducto.length === 0) {
                    toastr.warning("Debe relacionar insumos al producto.");
                    return;
                }

                vm.obj_nuevo_producto.ID_ITEM = vm.obj_nuevo_producto.ID_ITEM.toUpperCase();
                vm.obj_nuevo_producto.ID_REFERENCIA = vm.obj_nuevo_producto.ID_REFERENCIA.toUpperCase();
                vm.obj_nuevo_producto.DESCRIPCION = vm.obj_nuevo_producto.DESCRIPCION.toUpperCase();

                let request = {
                    datos_item: vm.obj_nuevo_producto,
                    insumos_producto: vm.dataInsumosProducto
                    //ID_USUARIO: loginService.UserData.ID_USUARIO
                };

                vm.objectDialog.LoadingDialog("...");
                RTAService.insertNuevoProducto(request)
                    .then(function (result) {

                        vm.objectDialog.HideDialog();

                        if (result.MSG === "OK") {
                            swal("Registro almacenado correctamente.", "", "success");
                            limpiar_formulario();

                        } else {
                            console.error(result.MSG);
                            toastr.error(result.MSG);
                        }
                    });
            }
        };

        //#region Control User Session

        vm.cookieUser = {};
        vm.cookieUser = $cookieStore.get('servlog');

        if (!_.isNull(vm.cookieUser)) {
            if (vm.cookieUser.hasSession && parseInt(vm.cookieUser.UserData.ID_USUARIO) === parseInt(loginService.UserData.ID_USUARIO)) {
                if ($location.$$path == "/cotRegNuevoProducto" && angular.verficar_perfil_usuario("cotRegNuevoProducto")) {

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

