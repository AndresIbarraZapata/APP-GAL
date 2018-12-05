(function () {
    'use strict';
    angular
        .module('appRTA')
        .controller('editarItemCot', editarItemCot);

    editarItemCot.$inject = ['configService', 'RTAService', '$scope', '$uibModalInstance', 'itemCot'];

    function editarItemCot(configService, RTAService, $scope, $uibModalInstance, itemCot) {
        var vm = $scope;

        vm.cancel = cancel;
        vm.cambio_cantidad_producto = cambio_cantidad_producto;
        vm.guardar_item = guardar_item;
        vm.totalizar_producto = totalizar_producto;
        vm.export_file_insumos = export_file_insumos;

        vm.dataInsumosProducto = [];
        vm.dataInsumosProductoSafe = [];

        itemCot.EMPAQUE_H  = itemCot.EMPAQUE_H.toString();
        itemCot.EMPAQUE_W  = itemCot.EMPAQUE_W.toString();
        itemCot.EMPAQUE_D  = itemCot.EMPAQUE_D.toString();
        itemCot.CUBICAGE_C = itemCot.CUBICAGE_C.toString();
        itemCot.CUBICAGE_K = itemCot.CUBICAGE_K.toString();
        itemCot.CANTIDAD   = itemCot.CANTIDAD.toString();
        itemCot.MARGEN = itemCot.MARGEN.toString();
        itemCot.PJ_DSCTO = itemCot.PJ_DSCTO.toString();

        vm.obj_producto_seleccionado = itemCot;
        vm.dominio = configService.variables.Dominio;
        vm.obj_totales = {
            costo_cliente: 0,
            descuento: 0,
            variacion: 0,
            mano_obra: 0,
            cif: 0,
            total: 0
        };

        vm.pjVariacion = loginService.UserData.PJ_VARIACION;

        //get_insumos_by_producto_cotizacion();
        get_materiales_productos_desarrollados();

        function export_file_insumos() {

            if (vm.dataInsumosProducto.length <= 0)
                return;

            var name_file = 'INSUMOS_' + vm.obj_producto_seleccionado.ID_REFERENCIA;

            alasql("SELECT * INTO XLSX('" + name_file + ".xlsx',{headers:true}) FROM ? ", [vm.dataInsumosProducto]);
        };

        function isRegistroValido(valor) {

            if (valor === null ||
                valor === undefined ||
                valor === "") {
                return false;
            }

            return true;
        }

        function guardar_item() {

            if (!isRegistroValido(vm.obj_producto_seleccionado.ID_ITEM)) {
                toastr.warning("Debe seleccionar un producto.");
                return;
            }

            if (!isRegistroValido(vm.obj_producto_seleccionado.CANTIDAD) || parseInt(vm.obj_producto_seleccionado.CANTIDAD) < 1) {
                toastr.warning("Debe ingresar una cantidad válida del producto.");
                return;
            }

            if (!isRegistroValido(vm.obj_producto_seleccionado.MARGEN)) {
                toastr.warning("Debe ingresar un margen válido del producto.");
                return;
            }

            if (!isRegistroValido(vm.obj_producto_seleccionado.EMPAQUE_H)) {
                toastr.warning("Debe ingresar un empaque H válido del producto.");
                return;
            }
            if (!isRegistroValido(vm.obj_producto_seleccionado.EMPAQUE_W)) {
                toastr.warning("Debe ingresar un empaque W válido del producto.");
                return;
            }
            if (!isRegistroValido(vm.obj_producto_seleccionado.EMPAQUE_D)) {
                toastr.warning("Debe ingresar un empaque D válido del producto.");
                return;
            }
            if (!isRegistroValido(vm.obj_producto_seleccionado.CUBICAGE_C)) {
                toastr.warning("Debe ingresar un cubicage C válido del producto.");
                return;
            }
            if (!isRegistroValido(vm.obj_producto_seleccionado.CUBICAGE_K)) {
                toastr.warning("Debe ingresar un cubicage K válido del producto.");
                return;
            }

            if (!isRegistroValido(vm.dataInsumosProducto) || vm.dataInsumosProducto.length < 1) {
                toastr.warning("No se permite agregar el producto, éste no cuenta con el detalle de material requerido.");
                return;
            }

            vm.obj_producto_seleccionado.data_insumo_producto = vm.dataInsumosProducto;
            vm.obj_producto_seleccionado.data_totales = vm.obj_totales;

            $uibModalInstance.close(vm.obj_producto_seleccionado);
        }

        function cambio_cantidad_producto() {
            if (!_.isNumber(parseFloat(vm.obj_producto_seleccionado.CANTIDAD)) || parseFloat(vm.obj_producto_seleccionado.CANTIDAD) < 1)
                vm.obj_producto_seleccionado.CANTIDAD = 1;

            vm.dataInsumosProducto.forEach((item) => {
                item.CANTIDAD_REQUERIDA = parseFloat(item.CANTIDAD_BASE) * parseFloat(vm.obj_producto_seleccionado.CANTIDAD);
                item.COSTO_PROM_FINAL = parseFloat(item.CANTIDAD_REQUERIDA) * parseFloat(item.COSTO_PROM_FINAL_BASE);
            });

            /*totalizar costos*/
            totalizar_producto();
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
            //vm.obj_totales.variacion = vm.obj_producto_seleccionado.VARIACION;
            vm.obj_totales.variacion = vm.obj_totales.costo_cliente * (vm.pjVariacion / 100);


            vm.obj_totales.descuento = parseFloat(vm.obj_producto_seleccionado.PJ_DSCTO / 100) * parseFloat(vm.obj_totales.costo_cliente);

            vm.obj_totales.total = (vm.obj_totales.costo_cliente +
                vm.obj_totales.mano_obra +
                vm.obj_totales.cif +
                vm.obj_totales.variacion) - (vm.obj_totales.descuento);
        }

        //function get_insumos_by_producto_cotizacion() {

        //    vm.objectDialog.LoadingDialog("...");
        //    RTAService.getInsumosByProductoCotizacion(vm.obj_producto_seleccionado.CS_ID_DT_COTIZACION)
        //        .then(function (data) {
        //            vm.objectDialog.HideDialog();
        //            if (data.data.length > 0 && data.data[0].length > 0) {

        //                vm.dataInsumosProductoSafe = _.sortBy(data.data[0], 'DESCRIPCION_C');
        //                vm.dataInsumosProducto = angular.copy(vm.dataInsumosProductoSafe);
        //            } else {
        //                toastr.warning("No se logró obtener los datos relacionados al producto seleccionado, intentelo de nuevo.");
        //            }
        //        });
        //}

        function get_materiales_productos_desarrollados() {

            vm.objectDialog.LoadingDialog("...");
            RTAService.getMaterialesProductosDesarrollados(vm.obj_producto_seleccionado.ID_ITEM)
                .then(function (data) {
                    vm.objectDialog.HideDialog();
                    angular.activarFancybox();
                    if (data.data.length > 0 && data.data[0].length > 0) {
                     
                        data.data[0].forEach((item) => {
                            item.COSTO_PROM_FINAL_BASE = item.COSTO_PROM_FINAL;
                        });

                        vm.dataInsumosProductoSafe = _.sortBy(data.data[0], 'DESCRIPCION_C');
                        vm.dataInsumosProducto = angular.copy(vm.dataInsumosProductoSafe);

                        cambio_cantidad_producto();

                    } else {
                        toastr.warning("No se logró obtener los datos relacionados al producto seleccionado, intentelo de nuevo.");
                    }

                });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        angular.activarBloqueoTAB(true);
    }
}());


