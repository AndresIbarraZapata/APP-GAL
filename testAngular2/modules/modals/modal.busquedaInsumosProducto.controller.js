(function () {
    'use strict';
    angular
        .module('appRTA')
        .controller('modalBusquedaInsumosProducto', modalBusquedaInsumosProducto);

    modalBusquedaInsumosProducto.$inject = ['modalService', '$timeout', 'configService', 'RTAService', '$scope', '$uibModalInstance', 'insumosProducto'];

    function modalBusquedaInsumosProducto(modalService, $timeout, configService, RTAService, $scope, $uibModalInstance, insumosProducto) {
        var vm = $scope;

        vm.cancel = cancel;
        vm.guardar = guardar;
       
        vm.dataInsumosProducto = insumosProducto;

        get_all_materiales_productos_desarrollados();

        function guardar() {
            
            /*verifico que no se haya seleccionado previamente el insumo*/
            if (_.where(vm.dataInsumosProducto, { ID_COD_ITEM_C: vm.obj_insumo_seleccionado.ID_COD_ITEM_C }).length > 0) {
                toastr.info("El insumo ya se encuentra registrado.");
                return;
            }

            $uibModalInstance.close(vm.obj_insumo_seleccionado);
        }

        function get_all_materiales_productos_desarrollados() {

            vm.objectDialog.LoadingDialog("...");
            RTAService.getAllMaterialesProductosDesarrollados()
                .then(function (data) {

                    if (data.data.length > 0 && data.data[0].length > 0) {
                        
                        vm.list_insumos_producto = _.uniq(data.data[0], function (item) {
                            return item.ID_COD_ITEM_C;
                        });

                        //vm.list_insumos_producto = data.data[0];
                        vm.list_insumos_producto.forEach(function (item, index) {
                            item.D_INSUMO = item.ID_COD_ITEM_C.trim() + " - " + item.ID_REFER_C.trim() + " - " + item.DESCRIPCION_C.trim();
                        });

                        vm.list_insumos_producto.push({
                            ID_COD_ITEM_C: 0,
                            D_INSUMO: "..."
                        });

                        vm.list_insumos_producto.forEach(function (item, index) {
                            item.id = item.ID_COD_ITEM_C;
                            item.text = item.D_INSUMO;

                            if (item.ID_COD_ITEM_C === 0)
                                item.selected = true;
                        });

                        $timeout(function () {
                            $("#seleccion_insumo").select2({
                                data: _.sortBy(vm.list_insumos_producto, 'text'),
                                language: "es"
                            });

                            vm.objectDialog.HideDialog();

                        }, 300);

                        $timeout(function () {
                            var $eventSelect = $("#seleccion_insumo");
                            $eventSelect.on("select2:select", function (e) {

                                vm.obj_insumo_seleccionado = {};
                                vm.obj_insumo_seleccionado = e.params.data;
                                
                                $timeout(function () {
                                    vm.$apply();
                                }, 0);
                            });
                        }, 300);

                    } else {
                        toastr.error("Ocurrió un error al tratar de obtener los tipos de proyectos.");
                    }
                });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        angular.activarBloqueoTAB(true);
    }
}());


