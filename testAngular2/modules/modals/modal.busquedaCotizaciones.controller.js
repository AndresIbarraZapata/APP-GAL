(function () {
    'use strict';
    angular
        .module('appRTA')
        .controller('busquedaCotizaciones', busquedaCotizaciones);

    busquedaCotizaciones.$inject = ['loginService', 'modalService', 'parametrosService', 'configService', 'RTAService', '$scope', '$uibModalInstance', '$timeout'];

    function busquedaCotizaciones(loginService, modalService, parametrosService, configService, RTAService, $scope, $uibModalInstance, $timeout) {
        var vm = $scope;
        
        vm.cancel = cancel;
        vm.getDetalleCotizacion = getDetalleCotizacion;

        vm.listaCotizacionesUsuario = [];
        vm.listaDetalleCotizacion = [];

        getCotizacionesByUsusario();

        function getDetalleCotizacion(item) {

            item.listaDetalleCotizacion = [];

            let csIdCotizacion = item.CS_ID_COTIZACION;

            vm.objectDialog.LoadingDialog("...");

            RTAService.getDetalleCotizacion(csIdCotizacion)
               .then(function (data) {
                   vm.objectDialog.HideDialog();
                   
                   if (data.data.length > 0 && data.data[0].length > 0) {
                       vm.listaDetalleCotizacion = data.data[0];

                       item.listaDetalleCotizacion = vm.listaDetalleCotizacion;

                   } else {
                       toastr.warning("No se encontró items asociados a la cotización");
                       vm.listaDetalleCotizacion = [];
                   }

                   $uibModalInstance.close(item);
               });
        }

        function getCotizacionesByUsusario() {

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

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        angular.activarBloqueoTAB(true);
    }
}());


