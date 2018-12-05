(function () {
    'use strict';
    angular
        .module('appRTA')
        .controller('detalleProductoModificacionInsumos', detalleProductoModificacionInsumos);

    detalleProductoModificacionInsumos.$inject = ['modalService', '$timeout', 'configService', 'RTAService', '$scope', '$uibModalInstance', 'producto'];

    function detalleProductoModificacionInsumos(modalService, $timeout, configService, RTAService, $scope, $uibModalInstance, producto) {
        var vm = $scope;

        vm.cancel = cancel;
        vm.export_file_insumos = export_file_insumos;
        vm.remover_insumo_producto = remover_insumo_producto;
        vm.guardar_insumos = guardar_insumos;
        vm.cambio_cant_requerida = cambio_cant_requerida;
        vm.show_modal_seleccion_insumo = show_modal_seleccion_insumo;

        vm.dataInsumosProducto = [];
        vm.dataInsumosProductoSafe = [];
        vm.obj_producto_seleccionado = producto;

        vm.dominio = configService.variables.Dominio;

        vm.dataInsumosProductoSafe = _.sortBy(producto.data_insumo_producto, 'DESCRIPCION_C');
        vm.dataInsumosProducto = angular.copy(vm.dataInsumosProductoSafe);
        
        vm.obj_totales = {
            costo_cliente: 0,
            descuento: 0,
            variacion: 0,
            mano_obra: 0,
            cif: 0,
            total: 0
        };

        function show_modal_seleccion_insumo() {

            modalService.modalFormBusquedaInsumosProducto(vm.dataInsumosProducto)
                .then((insumo) => {

                    insumo.COSTO_PROM_FINAL_BASE = insumo.COSTO_PROM_FINAL;
                    //insumo.COSTO_PROM_FINAL = parseFloat(insumo.CANTIDAD_REQUERIDA) * parseFloat(insumo.COSTO_PROM_FINAL_BASE);

                    vm.dataInsumosProductoSafe.push(insumo);

                    vm.dataInsumosProducto = [];

                    $timeout(function () {
                        vm.dataInsumosProducto = angular.copy(vm.dataInsumosProductoSafe);
                        totalizar_producto();
                    }, 300);

                    angular.activarFancybox();
                });
        }
        
        function cambio_cant_requerida(insumo) {

            vm.dataInsumosProducto.filter((item, index) => {

                if (parseInt(item.ID_COD_ITEM_C) === parseInt(insumo.ID_COD_ITEM_C)) {
                    item.COSTO_PROM_FINAL = parseFloat(item.CANTIDAD_REQUERIDA) * parseFloat(item.COSTO_PROM_FINAL_BASE);
                }
            });

            $timeout(function () {

                vm.$apply();
                totalizar_producto();
            }, 300);
        }

        function totalizar_producto() {

            vm.obj_totales.costo_cliente = 0;
            vm.obj_totales.mano_obra = 0;
            vm.obj_totales.cif = 0;
            vm.obj_totales.variacion = 0;
            vm.obj_totales.total = 0;

            vm.obj_totales.descuento = 0;

            vm.dataInsumosProducto.forEach((item) => {
                vm.obj_totales.costo_cliente += parseFloat(item.COSTO_PROM_FINAL);
            });

            vm.obj_totales.mano_obra = vm.obj_producto_seleccionado.MANO_OBRA;
            vm.obj_totales.cif = vm.obj_producto_seleccionado.CIF;
            vm.obj_totales.variacion = vm.obj_producto_seleccionado.VARIACION;

            vm.obj_totales.descuento = parseFloat(vm.obj_producto_seleccionado.PJ_DSCTO / 100) * parseFloat(vm.obj_totales.costo_cliente);

            vm.obj_totales.total = (vm.obj_totales.costo_cliente +
                vm.obj_totales.mano_obra +
                vm.obj_totales.cif +
                vm.obj_totales.variacion) - (vm.obj_totales.descuento);

            vm.obj_producto_seleccionado.data_totales = vm.obj_totales;
        }

        function guardar_insumos() {

            if (vm.dataInsumosProducto.length === 0) {
                toastr.error("No se permite almacenar el registro si no tiene insumos asignados.");
                return;
            }

            //vm.obj_producto_seleccionado 


            let text_confirm = "Está seguro de continuar con los cambios realizados?";
            modalService.modalFormConfirmacion(text_confirm)
                .then(() => {
                    
                    let request = {
                        datos_item: vm.obj_producto_seleccionado,
                        insumos_producto: vm.dataInsumosProducto
                        //ID_USUARIO: loginService.UserData.ID_USUARIO
                    };

                    vm.objectDialog.LoadingDialog("...");
                    RTAService.insertNuevoProducto(request)
                        .then(function (result) {

                            vm.objectDialog.HideDialog();

                            if (result.MSG === "OK") {
                                swal("Registro almacenado correctamente.", "", "success");
                                $uibModalInstance.close();
                                
                            } else {
                                console.error(result.MSG);
                                toastr.error(result.MSG);
                            }
                        });
                });
        }

        function remover_insumo_producto(insumo) {

            vm.dataInsumosProducto = [];

            let indexInsumo = null;
            vm.dataInsumosProductoSafe.filter((item, index) => {

                if (parseInt(item.ID_COD_ITEM_C) === parseInt(insumo.ID_COD_ITEM_C)) {
                    indexInsumo = index;
                }
            });

            if (indexInsumo !== null) {
                vm.dataInsumosProductoSafe.splice(indexInsumo, 1);
            }

            $timeout(function() {
                vm.dataInsumosProducto = angular.copy(vm.dataInsumosProductoSafe);
                totalizar_producto();
            },300);
        }

        function export_file_insumos() {

            if (vm.dataInsumosProducto.length <= 0)
                return;

            var name_file = 'INSUMOS_' + vm.obj_producto_seleccionado.ID_REFERENCIA;

            alasql("SELECT * INTO XLSX('" + name_file + ".xlsx',{headers:true}) FROM ? ", [vm.dataInsumosProducto]);
        };

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        angular.activarBloqueoTAB(true);
    }
}());


