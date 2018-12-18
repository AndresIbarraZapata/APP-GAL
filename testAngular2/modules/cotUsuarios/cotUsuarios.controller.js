/**
 * @author: desarrollo web
 */
(function () {
    'use strict';

    angular.module('appRTA')
        .controller('cotUsuarios', cotUsuarios);

    cotUsuarios.$inject = ['$upload', 'parametrosService', '$scope', 'configService', 'loginService', '$timeout', '$location', '$cookieStore', '$rootScope', '$uibModal', 'RTAService', 'modalService', '$constants'];

    function cotUsuarios($upload, parametrosService, $scope, configService, loginService, $timeout, $location, $cookieStore, $rootScope, $uibModal, RTAService, modalService, $constants) {
        var vm = $scope;

        function init() {

            vm.limpiar = limpiar;
            //vm.validar_adjunto = validar_adjunto;
            //vm.delete_adjunto = delete_adjunto;
            //vm.guardar_producto = guardar_producto;

            vm.obj_producto_seleccionado = {};

            vm.list_productos_desarrollados = [];
            vm.objUsuarios = {
                nombres: "",
                apellidos: "",
                cargo: "",
                perfil: "",
                usuario: "",
                password: "",
                documento: "",
                cs_id_usuario: loginService.UserData.ID_USUARIO,
                bodega:'00103'
            };


     
            function limpiar() {
                vm.objUsuarios = {
                    nombres: "",
                    apellidos: "",
                    cargo: "",
                    perfil: "",
                    usuario: "",
                    password: "",
                    documento: "",
                    cs_id_usuario: loginService.UserData.ID_USUARIO,
                    bodega: '00103'
                };
            }
            
            //function get_materiales_productos_desarrollados() {

            //    vm.objectDialog.LoadingDialog("...");
            //    RTAService.getAllMaterialesProductosDesarrollados()
            //        .then(function (data) {

            //            if (data.data.length > 0 && data.data[0].length > 0) {
            //                vm.objectDialog.HideDialog();
            //                vm.listaMateriales = data.data[0];
                         
            //                //$timeout(function () {
            //                //    $("#seleccion_proyecto").select2({
            //                //        data: _.sortBy(vm.list_productos_desarrollados, 'text'),
            //                //        language: "es"
            //                //    });

            //                //    vm.objectDialog.HideDialog();
            //                //}, 300);
                            
            //                //$timeout(function () {
            //                //    var $eventSelect = $("#seleccion_proyecto");
            //                //    $eventSelect.on("select2:select", function (e) {

            //                //        vm.obj_producto_seleccionado = {};
            //                //        vm.obj_producto_seleccionado = e.params.data;

            //                //        $timeout(function () {
            //                //            vm.$apply();
            //                //        }, 0);
            //                //    });
            //                //}, 300);
            //            } else {
            //                toastr.error("Ocurrió un error al tratar de obtener los tipos de proyectos.");
            //            }
            //        });
            //}


       



                    vm.insertUsuario = function () {


                        if (vm.objUsuarios.nombres === "") {
                            toastr.info('Debe ingreaar el nombre');
                            return;
                        }

                        if (vm.objUsuarios.apellidos === "") {
                            toastr.info('Debe ingreaar los apellidos');
                            return;
                        }
                        if (vm.objUsuarios.documento === "") {
                            toastr.info('Debe ingreaar el documento');
                            return;
                        }

                        if (vm.objUsuarios.cargo === "") {
                            toastr.info('Debe ingreaar el cargo');
                            return;
                        }

                        if (vm.objUsuarios.perfil === "") {
                            toastr.info('Debe ingreaar el PERFIL');
                            return;
                        }


                        if (vm.objUsuarios.usuario === "") {
                            toastr.info('Debe ingreaar el usuario');
                            return;
                        }

                        if (vm.objUsuarios.password === "") {
                            toastr.info('Debe ingreaar la contraseña');
                            return;
                        }

                        RTAService.insertUsuario(vm.objUsuarios)

                            .then(function (result) {

                                if (result.MSG === "OK") {
                                    console.log('Registros actualizados correctamente');

                                    swal("DATOS actualizados", "Se actualizó el usuario correctamente", "success");
                                    limpiar()

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
                if ($location.$$path == "/cotUsuarios" && angular.verficar_perfil_usuario("cotUsuarios")) {

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

