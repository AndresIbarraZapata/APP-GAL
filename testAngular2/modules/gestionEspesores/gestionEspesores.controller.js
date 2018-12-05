/**
 * @author: desarrollo web
 */
(function () {
    'use strict';

    angular.module('appRTA')
        .controller('gestionEspesores', gestionEspesores);

    gestionEspesores.$inject = ['$upload', 'parametrosService', '$scope', 'configService', 'loginService', '$timeout', '$location', '$cookieStore', '$rootScope', '$uibModal', 'RTAService', 'modalService', '$constants'];

    function gestionEspesores($upload, parametrosService, $scope, configService, loginService, $timeout, $location, $cookieStore, $rootScope, $uibModal, RTAService, modalService, $constants) {
        var vm = $scope;

        function init() {

            vm.limpiar_formulario = limpiar_formulario;
            //vm.validar_adjunto = validar_adjunto;
            //vm.delete_adjunto = delete_adjunto;
            //vm.guardar_producto = guardar_producto;

            vm.obj_producto_seleccionado = {};
            vm.list_adjuntos = [];
            vm.list_productos_desarrollados = [];
            vm.objDataEspesor = {
                tipoEspesor: "",
                c_referencia: "",
                espesor:""

            };

            vm.listaMateriales = []

            //get_materiales_productos_desarrollados();

            function limpiar_formulario() {
                vm.list_adjuntos = [];
                vm.obj_producto_seleccionado = {};
                $('#seleccion_proyecto').val(null).trigger('change');

                $timeout(() => {
                    vm.$apply();
                }, 0);
            }
            
            function get_materiales_productos_desarrollados() {

                vm.objectDialog.LoadingDialog("...");
                RTAService.getAllMaterialesProductosDesarrollados()
                    .then(function (data) {

                        if (data.data.length > 0 && data.data[0].length > 0) {
                            vm.objectDialog.HideDialog();
                            vm.listaMateriales = data.data[0];
                         
                            //$timeout(function () {
                            //    $("#seleccion_proyecto").select2({
                            //        data: _.sortBy(vm.list_productos_desarrollados, 'text'),
                            //        language: "es"
                            //    });

                            //    vm.objectDialog.HideDialog();
                            //}, 300);
                            
                            //$timeout(function () {
                            //    var $eventSelect = $("#seleccion_proyecto");
                            //    $eventSelect.on("select2:select", function (e) {

                            //        vm.obj_producto_seleccionado = {};
                            //        vm.obj_producto_seleccionado = e.params.data;

                            //        $timeout(function () {
                            //            vm.$apply();
                            //        }, 0);
                            //    });
                            //}, 300);
                        } else {
                            toastr.error("Ocurrió un error al tratar de obtener los tipos de proyectos.");
                        }
                    });
            }


       



                    vm.insertEspesores = function () {


                        if (vm.objDataEspesor.tipoEspesor === "") {
                            toastr.info('Debe ingreaar tipo espesor');
                            return;
                        }
                        //if (vm.objDataEspesor.referencia === "") {
                        //    toastr.info('Debe ingresar la referencia');
                        //    return;
                        //}

                        if (vm.objDataEspesor.espesor === "") {
                            toastr.info('Debe ingresar el espesor');
                            return;
                        }

                        swal("DATOS ACTUALIZADOS", "Se guardo la información correctamente", "success");
                        init()
                        return;


                        RTAService.insertEspesores(vm.objDataEspesor)

                            .then(function (result) {

                                if (result.MSG === "OK") {
                                    console.log('Registros actualizados correctamente');

                                    swal("DATOS actualizados", "Se actualizo el costo correctamente", "success");

                                }
                                else {

                                    toastr.warning(result.MSG);
                                    sweetAlert("ERROR", "No se actualizaron los datos", "error");
                                }

                            });



                    }



    
        };

        //#region Control User Session

        vm.cookieUser = {};
        vm.cookieUser = $cookieStore.get('servlog');

        if (!_.isNull(vm.cookieUser)) {
            if (vm.cookieUser.hasSession && parseInt(vm.cookieUser.UserData.ID_USUARIO) === parseInt(loginService.UserData.ID_USUARIO)) {
                if ($location.$$path == "/gestionEspesores" && angular.verficar_perfil_usuario("gestionEspesores")) {

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

