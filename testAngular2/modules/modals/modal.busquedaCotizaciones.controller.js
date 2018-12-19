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
        vm.cambiarEstadoPedido = cambiarEstadoPedido

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


        function cambiarEstadoPedido(item) {

            return;
             var csIdCotizacion = item.CS_ID_COTIZACION;
            var estado = item.ESTADO_COTIZACION
            if (estado === 1) {
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
                        CS_H_COTIZACION:  csIdCotizacion,
                        ESTADO_COTIZACION: 1, //cerrado
                        ID_USUARIO: loginService.UserData.ID_USUARIO
                    };

                    vm.objectDialog.LoadingDialog("...");
                    RTAService.updateEstadoHCotizaciones(request)
                        .then(function (result) {

                            vm.objectDialog.HideDialog();

                            if (result.MSG === "OK") {
                                swal("COTIZACIÓN CERRADA CORRECTAMENTE.", "", "success");
                                limpiar_formulario();
                            } else {
                                console.error(result.MSG);
                                toastr.error(result.MSG);
                            }
                        });
                });
        }



        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        angular.activarBloqueoTAB(true);
    }
}());


