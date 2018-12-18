(function () {
    'use strict';
    angular
        .module('appRTA')
        .controller('modalFrmAddNuevoProyecto', modalFrmAddNuevoProyecto);

    modalFrmAddNuevoProyecto.$inject = ['modalService', 'parametrosService', 'configService', 'RTAService', '$scope', '$uibModalInstance', '$timeout', 'listProductosSeleccionados'];

    function modalFrmAddNuevoProyecto(modalService, parametrosService, configService, RTAService, $scope, $uibModalInstance, $timeout, listProductosSeleccionados) {
        var vm = $scope;

        vm.cancel                   = cancel;
        vm.guardar_item             = guardar_item;
        vm.cambio_cantidad_producto = cambio_cantidad_producto;
        vm.totalizar_producto       = totalizar_producto;
        vm.export_file_insumos = export_file_insumos;

        vm.obj_producto_seleccionado = {};
        vm.list_productos_desarrollados = [];
        vm.data_materiales_producto = [];
        vm.dataInsumosProductoSafe = [];
        vm.dataInsumosProducto = [];
        vm.dominio = configService.variables.Dominio;

        vm.obj_totales = {
            costo_cliente: 0,
            descuento: 0,
            variacion: 0,
            mano_obra: 0,
            cif: 0,
            total: 0
        };

        get_productos_desarrollados();

        function export_file_insumos() {

            if (vm.dataInsumosProducto.length <= 0)
                return;
            
            var name_file = 'INSUMOS_' + vm.obj_producto_seleccionado.ID_REFERENCIA;

            alasql("SELECT * INTO XLSX('" + name_file + ".xlsx',{headers:true}) FROM ? ", [vm.dataInsumosProducto]);
        };

        function cambio_cantidad_producto() {
            if (!_.isNumber(parseFloat(vm.obj_producto_seleccionado.CANTIDAD)) || parseFloat(vm.obj_producto_seleccionado.CANTIDAD) < 1)
                vm.obj_producto_seleccionado.CANTIDAD = 1;

            vm.obj_producto_seleccionado.VALOR = parseFloat(vm.obj_producto_seleccionado.CANTIDAD) * parseFloat(vm.obj_producto_seleccionado.VALOR);

            if (vm.obj_producto_seleccionado.CANTIDAD > vm.obj_producto_seleccionado.CAN_DISPONIBLE) {
                vm.obj_producto_seleccionado.SW_SIN_DISPONIBILIDAD = true;
            } else {
                vm.obj_producto_seleccionado.SW_SIN_DISPONIBILIDAD = false;
            }
            //vm.obj_producto_seleccionado.forEach((item) => {
            //    item.VALOR = parseFloat(item.CANTIDAD) * parseFloat(item.VALOR);

            //});

            /*totalizar costos*/
            //totalizar_producto();
        }

        function totalizar_producto() {
           
   

            vm.obj_producto_seleccionado.forEach((item) => {
                vm.obj_totales.costo_cliente += parsefloat(item.costo_prom_final);
         

            });

      
        }

        vm.listaMotivos = [];
        vm.listaPrecios = [];

        function get_productos_desarrollados() {

            vm.objectDialog.LoadingDialog("...");
            RTAService.getProductosDesarrollados()
                .then(function (data) {
              
                    if (data.data.length > 0 && data.data[0].length > 0) {
                        vm.listaMotivos = data.data[1];

                        vm.list_productos_desarrollados = data.data[0];
                        vm.list_productos_desarrollados.forEach(function (item, index) {
                            item.D_REFERENCIA =  item.REFERENCIA_PT.trim() + " - " + item.D_REFERENCIA_PT.trim();
                            
                            item.REFERENCIA_PT = item.REFERENCIA_PT.trim();
                            item.D_REFERENCIA_PT = item.D_REFERENCIA_PT.trim();
                            item.PJ_DSCTO = item.PJ_DSCTO.toString();
                            if (item.CANTIDAD > item.CAN_DISPONIBLE) {
                                item.SW_SIN_DISPONIBILIDAD = true;
                            } else {
                                item.SW_SIN_DISPONIBILIDAD = false;
                            }

                        });

                        vm.list_productos_desarrollados.push({
                            ID_ITEM: 0,
                            D_REFERENCIA: "..."
                        });

                        vm.list_productos_desarrollados.forEach(function (item, index) {
                            item.id = item.ID_ITEM;
                            item.text = item.D_REFERENCIA;

                            if (item.ID_ITEM === 0)
                                item.selected = true;
                        });
                        
                        $timeout(function () {
                            $("#seleccion_proyecto").select2({
                                data: _.sortBy(vm.list_productos_desarrollados, 'text'),
                                language: "es"
                            });

                            vm.objectDialog.HideDialog();
                        }, 300);

                        $timeout(function () {
                            var $eventSelect = $("#seleccion_proyecto");
                            $eventSelect.on("select2:select", function (e) {

                                vm.obj_producto_seleccionado = {};
                                vm.obj_producto_seleccionado = e.params.data;
                                //get_materiales_productos_desarrollados();

                                $timeout(function () {
                                    vm.$apply();
                                }, 0);
                            });
                        }, 300);

                    } else {
                        toastr.error("Ocurrió un error al tratar de obtener los productos.");
                    }
                });
        }
        
        //function get_materiales_productos_desarrollados() {

        //    vm.objectDialog.LoadingDialog("...");
        //    RTAService.getMaterialesProductosDesarrollados(vm.obj_producto_seleccionado.ID_ITEM)
        //        .then(function(data) {
        //            vm.objectDialog.HideDialog();
        //            angular.activarFancybox();
        //            if (data.data.length > 0 && data.data[0].length > 0) {
        //                //vm.data_materiales_producto = data.data[0];
        //                //vm.obj_producto_seleccionado.data_materiales_producto = _.sortBy(data.data[0], 'DESCRIPCION_C');

        //                data.data[0].forEach((item) => {
        //                    item.COSTO_PROM_FINAL_BASE = item.COSTO_PROM_FINAL;
        //                    item.COSTO_PROM_FINAL = parseFloat(item.CANTIDAD_REQUERIDA) * parseFloat(item.COSTO_PROM_FINAL_BASE);
        //                });
                        
        //                vm.dataInsumosProductoSafe = _.sortBy(data.data[0], 'DESCRIPCION_C');
        //                vm.dataInsumosProducto = angular.copy(vm.dataInsumosProductoSafe);

        //                totalizar_producto();
        //            } else {
        //                toastr.warning("No se logró obtener los datos relacionados al producto seleccionado, intentelo de nuevo.");
        //            }
                    
        //        });
        //}

        function guardar_item() {

            if (!isRegistroValido(vm.obj_producto_seleccionado.ID_ITEM)) {
                toastr.warning("Debe seleccionar un producto.");
                return;
            }

            /*verificar si la referencia fué previamente seleccionada*/
            let data_producto_seleccion_previa = _.where(listProductosSeleccionados, { ID_ITEM: vm.obj_producto_seleccionado.ID_ITEM });
            if (data_producto_seleccion_previa.length > 0) {
                toastr.warning("El producto ya se encuentra seleccionado.");
                return;
            }

            if (!isRegistroValido(vm.obj_producto_seleccionado.CANTIDAD) || parseInt(vm.obj_producto_seleccionado.CANTIDAD) < 1) {
                toastr.warning("Debe ingresar una cantidad válida del producto.");
                return;
            }


            if (vm.obj_producto_seleccionado.SW_SIN_DISPONIBILIDAD) {
                toastr.info("El producto que va agregar se encuentra sin disponibilidad de inventario para la cantidad solicitada");
                return;
            }

            //if (!isRegistroValido(vm.obj_producto_seleccionado.MARGEN)) {
            //    toastr.warning("Debe ingresar un margen válido del producto.");
            //    return;
            //}

            //if (!isRegistroValido(vm.obj_producto_seleccionado.EMPAQUE_H)) {
            //    toastr.warning("Debe ingresar un empaque H válido del producto.");
            //    return;
            //}
            //if (!isRegistroValido(vm.obj_producto_seleccionado.EMPAQUE_W)) {
            //    toastr.warning("Debe ingresar un empaque W válido del producto.");
            //    return;
            //}
            //if (!isRegistroValido(vm.obj_producto_seleccionado.EMPAQUE_D)) {
            //    toastr.warning("Debe ingresar un empaque D válido del producto.");
            //    return;
            //}
            //if (!isRegistroValido(vm.obj_producto_seleccionado.CUBICAGE_C)) {
            //    toastr.warning("Debe ingresar un cubicage C válido del producto.");
            //    return;
            //}
            //if (!isRegistroValido(vm.obj_producto_seleccionado.CUBICAGE_K)) {
            //    toastr.warning("Debe ingresar un cubicage K válido del producto.");
            //    return;
            //}
            
            //if (!isRegistroValido(vm.dataInsumosProducto) || vm.dataInsumosProducto.length < 1) {
            //    toastr.warning("No se permite agregar el producto, éste no cuenta con el detalle de material requerido.");
            //    return;
            //}
            
            //vm.obj_producto_seleccionado.data_insumo_producto = vm.dataInsumosProducto;
            //vm.obj_producto_seleccionado.data_totales         = vm.obj_totales;

            $uibModalInstance.close(vm.obj_producto_seleccionado);
        }

        function isRegistroValido(valor) {
            
            if (valor === null ||
                valor === undefined ||
                valor === "" ) {
                return false;
            }

            return true;
        }

        //vm.HH = function(valor) {
        //    if (valor === null ||
        //        valor === undefined ||
        //        valor === "" ||
        //        parseInt(valor) < 1) {
        //        return false;
        //    }

        //    return true;
        //};

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        angular.activarBloqueoTAB(true);
    }
}());


