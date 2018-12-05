(function () {
    'use strict';
    angular
        .module('appRTA')
        .controller('detalleProducto', detalleProducto);

    detalleProducto.$inject = ['configService', 'RTAService', '$scope', '$uibModalInstance', 'producto'];

    function detalleProducto(configService, RTAService, $scope, $uibModalInstance, producto) {
        var vm = $scope;

        vm.cancel = cancel;
        vm.export_file_insumos = export_file_insumos;

        vm.dataInsumosProducto = [];
        vm.dataInsumosProductoSafe = [];
        vm.obj_producto_seleccionado = producto;

        vm.dominio = configService.variables.Dominio;

        vm.dataInsumosProductoSafe = _.sortBy(producto.data_insumo_producto, 'DESCRIPCION_C');
        vm.dataInsumosProducto = angular.copy(vm.dataInsumosProductoSafe);

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


