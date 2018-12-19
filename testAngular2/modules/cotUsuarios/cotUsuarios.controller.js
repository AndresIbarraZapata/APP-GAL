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
            vm.getUsuarios = getUsuarios;
            vm.verUpdateUsuario = verUpdateUsuario;
            //vm.guardar_producto = guardar_producto;

            vm.obj_producto_seleccionado = {};

            vm.listaUsuarios = [];

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


            vm.swAgregarUsuario = false;
            vm.swModificar = false;
            vm.listaPerfiles = [];


     
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
                    bodega: '00103',
                    id_usuario:""
                };
            }
            
            function getUsuarios() {
                vm.listaUsuarios = [];
                vm.objectDialog.LoadingDialog("...");
                RTAService.getUsuarios()
                    .then(function (data) {

                        if (data.data.length > 0 && data.data[0].length > 0) {
                            vm.objectDialog.HideDialog();
                            vm.listaUsuarios = data.data[0];
                            vm.listaPerfiles = data.data[1];
                        } else {
                            toastr.error("Ocurrió un error al tratar de obterner los usuarios");
                        }
                    });
            }

            getUsuarios();


            function verUpdateUsuario(item) {

                vm.objUsuarios = {
                    nombres: "",
                    apellidos: "",
                    cargo: "",
                    perfil: "",
                    usuario: "",
                    password: "",
                    documento: "",
                    cs_id_usuario: loginService.UserData.ID_USUARIO,
                    bodega: '00103',
                    id_usuario:""
                };


                vm.swAgregarUsuario = true;
                vm.swModificar = true;

                vm.objUsuarios.id_usuario = item.ID_USUARIO;
                vm.objUsuarios.nombres = item.NOMBRES_USUARIO;
                vm.objUsuarios.apellidos = item.APELLIDOS_USUARIO;
                vm.objUsuarios.cargo = item.CARGO;
                vm.objUsuarios.usuario = item.USUARIO;
                vm.objUsuarios.password = item.PASSWORD_USUARIO;
                vm.objUsuarios.documento = item.DOCUMENTO;
                vm.objUsuarios.bodega = '00103';

            }


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
                            getUsuarios();
                            vm.swAgregarUsuario = false;
                            vm.swModificar = false;

                        }
                        else {

                            toastr.warning(result.MSG);
                            sweetAlert("ERROR", "No se actualizaron los datos", "error");
                        }

                    });



            }



            vm.updateUsuario = function () {


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

                RTAService.updateUsuario(vm.objUsuarios)

                    .then(function (result) {

                        if (result.MSG === "OK") {
                            console.log('Registros actualizados correctamente');

                            swal("DATOS actualizados", "Se actualizó el usuario correctamente", "success");
                            limpiar()
                            getUsuarios();
                            vm.swAgregarUsuario = false;
                            vm.swModificar = false;
                        }
                        else {

                            toastr.warning(result.MSG);
                            sweetAlert("ERROR", "No se actualizaron los datos", "error");
                        }

                    });

            }



            vm.eliminarUsuario = function (item) {


                let text_confirm = "Está seguro de ELIMINAR EL USUARIO?";
                modalService.modalFormConfirmacion(text_confirm)
                    .then(() => {

                        let request = {
                            CS_ID_USUARIO: item.ID_USUARIO
                        };

                        vm.objectDialog.LoadingDialog("...");
                        RTAService.eliminarUsuario(request)
                            .then(function (result) {

                                vm.objectDialog.HideDialog();

                                if (result.data.MSG === "OK") {
                                    swal("USUARIO ELIMINADO CORRECTAMENTE.", "", "success");
                                    limpiar()
                                    getUsuarios();
                                    vm.swAgregarUsuario = false;
                                    vm.swModificar = false;
                             
                                } else {
                                    console.error(result.MSG);
                                    toastr.error(result.MSG);
                                }
                            });
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

