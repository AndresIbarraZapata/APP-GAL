(function () {
    'use strict';
    angular
        .module('appRTA')
        .controller('busquedaCostosMdc', busquedaCostosMdc);

    busquedaCostosMdc.$inject = ['loginService', 'modalService', 'parametrosService', 'configService', 'RTAService', '$scope', '$uibModalInstance', '$timeout'];

    function busquedaCostosMdc(loginService, modalService, parametrosService, configService, RTAService, $scope, $uibModalInstance, $timeout) {
        var vm = $scope;
        
        vm.cancel = cancel;
        //vm.getDetalleCotizacion = getDetalleCotizacion;
        vm.anularCostoMdc = anularCostoMdc;
        //vm.mostrarDetallearchivoCostos = mostrarDetallearchivoCostos;

        vm.listaHistoricoCostosMdc = [];
        vm.listaDetalleCotizacion = [];
        vm.listaDetalleCostosMDC = [];

        getHistoricoCostosMdc();

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

        function getHistoricoCostosMdc() {

             vm.objectDialog.LoadingDialog("...");

            RTAService.getHistoricoCostosMdc()
                .then(function (data) {
                    vm.objectDialog.HideDialog();
                    
                    if (data.data.length > 0 && data.data[0].length > 0) {
                        vm.listaHistoricoCostosMdc = data.data[0];

                    } else {
                        toastr.warning("No se encontró ningun costo MDC ");
                        vm.listaHistoricoCostosMdc = [];
                    }
                });
        }


        function anularCostoMdc(item) {
            vm.objanularCostoMdc =
            {
                cdIdCostos: "",
                csIdUsuario: loginService.UserData.ID_USUARIO
            }

            vm.objanularCostoMdc.cdIdCostos = item.CS_ID_COSTOS_MDC;

            RTAService.anularCostoMdc(vm.objanularCostoMdc)

             .then(function (result) {

                 if (result.MSG === "OK") {
                     console.log('Registros actualizados correctamente');

                     swal("DATOS ACTUALIZADOS", "se realizo la anulacion correctamente", "success");
                
                     $uibModalInstance.close();
                  

                 }
                 else {

                     toastr.warning(result.MSG);
                     sweetAlert("ERROR", "No se actualizaron los datos", "error");
                 }

             });

        }

        function getDetallearchivoCostos() {
            angular.element(document).ready(function () {
                $("#modal-detalle-costo-mdc").modal(
                    {
                        show: true,
                        backdrop: 'static',
                        keyboard: false
                    });
            });


            vm.objectDialog.LoadingDialog("...");
            let cdIdCosto = item.CS_ID_COSTOS_MDC
            RTAService.getDetallearchivoCostos(cdIdCosto)
                .then(function (data) {
                    vm.objectDialog.HideDialog();

                    if (data.data.length > 0 && data.data[0].length > 0) {
                        vm.listaDetalleCostosMDC = data.data[0];

                    } else {
                        toastr.warning("No se encontró ningun costo MDC ");
                        vm.listaDetalleCostosMDC = [];
                    }
                });

        }


        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        angular.activarBloqueoTAB(true);
    }
}());


