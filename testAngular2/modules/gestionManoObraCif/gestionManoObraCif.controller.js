/**
 * @author: desarrollo web
 */
(function () {
    'use strict';

    angular.module('appRTA')
        .controller('gestionManoObraCif', gestionManoObraCif);

    gestionManoObraCif.$inject = ['$upload', 'parametrosService', '$scope', 'configService', 'loginService', '$timeout', '$location', '$cookieStore', '$rootScope', '$uibModal', 'RTAService', 'modalService', '$constants'];

    function gestionManoObraCif($upload, parametrosService, $scope, configService, loginService, $timeout, $location, $cookieStore, $rootScope, $uibModal, RTAService, modalService, $constants) {
        var vm = $scope;

        function init() {

            vm.limpiar_formulario = limpiar_formulario;
            vm.validar_adjunto = validar_adjunto;
            vm.delete_adjunto = delete_adjunto;
            vm.guardar_producto = guardar_producto;

            vm.obj_producto_seleccionado = {};
            vm.list_adjuntos = [];
            vm.list_productos_desarrollados = [];
            vm.obj_data_adjunto = {};

            get_productos_desarrollados_for_gestion_imagen();

            function limpiar_formulario() {
                vm.list_adjuntos = [];
                vm.obj_producto_seleccionado = {};
                $('#seleccion_proyecto').val(null).trigger('change');

                $timeout(() => {
                    vm.$apply();
                }, 0);
            }

            vm.objManoObra = {
                espesor: "",
                tipoGestion: "",
                tableros:""
            }


            vm.insertMManoObra = function () {


                if (vm.objManoObra.tipoGestion === "") {
                    toastr.info('Debe ingreaar tipo gestión');
                    return;
                }
                if (vm.objManoObra.espesor === "") {
                    toastr.info('Debe ingresar el espesor');
                    return;
                }

                if (vm.objManoObra.tableros === "") {
                    toastr.info('Debe ingresar el número de tableros por minuto');
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


            
            function get_productos_desarrollados_for_gestion_imagen() {

                vm.objectDialog.LoadingDialog("...");
                RTAService.getProductosDesarrolladosForGestionImagen()
                    .then(function (data) {

                        if (data.data.length > 0 && data.data[0].length > 0) {

                            vm.list_productos_desarrollados = data.data[0];
                            vm.list_productos_desarrollados.forEach(function (item, index) {
                                item.D_REFERENCIA = item.ID_ITEM.trim() + " - " + item.ID_REFERENCIA.trim() + " - " + item.DESCRIPCION.trim();

                                item.ID_REFERENCIA = item.ID_REFERENCIA.trim();
                                item.DESCRIPCION = item.DESCRIPCION.trim();
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

            function validar_adjunto(files) {
          
                vm.list_adjuntos = [];

                for (var i = 0; i < files.length; i++) {

                    var ext = (files[i].name).split(".");
                    ext = ext[ext.length - 1].toUpperCase();

                    if (ext !== "PNG" && ext !== "JPG" && ext !== "JPEG") {
                        toastr.warning("Solo se puede cargar archivos de imagenes.");
                        return;
                    }

                    vm.list_adjuntos.push(files[i]);
                    vm.obj_data_adjunto = files[i];
                }
            };

            function delete_adjunto(index) {
                vm.list_adjuntos.splice(index, 1);
            };

            function guardar_producto() {

                if (vm.obj_producto_seleccionado.ID_ITEM === undefined ||
                    vm.obj_producto_seleccionado.ID_ITEM === null ||
                    vm.obj_producto_seleccionado.ID_ITEM === "") {

                    toastr.warning("Debe seleccionar un producto.");
                    return;
                }
                
                if (vm.list_adjuntos.length === 0) {
                    toastr.warning("Es requerido adjuntar una imagen.");
                    return;
                }

                vm.obj_producto_seleccionado.adjunto = vm.list_adjuntos;

                $upload.upload({
                    url: configService.ApiUrls.UrlGestionCotizaciones + "almacenar_imagen_producto",
                    method: "POST",
                    headers: { 'Content-Type': 'multipart/form-data' },
                    file: vm.obj_producto_seleccionado.adjunto,
                    data: vm.obj_producto_seleccionado
                }).success(function (result, status, headers, config) {

                    if (result.MSG === "OK") {
                        swal({
                            type: "success",
                            text: "Archivo almacenado correctamente."
                        });

                        limpiar_formulario();
                    } else {
                        toastr.error("Error: " + result.MSG);
                    }

                }).error(function (data, status, headers, config) {
                    console.error("almacenar_imagen_producto", data);
                });
            }
        };

        //#region Control User Session

        vm.cookieUser = {};
        vm.cookieUser = $cookieStore.get('servlog');

        if (!_.isNull(vm.cookieUser)) {
            if (vm.cookieUser.hasSession && parseInt(vm.cookieUser.UserData.ID_USUARIO) === parseInt(loginService.UserData.ID_USUARIO)) {
                if ($location.$$path == "/gestionManoObraCif" && angular.verficar_perfil_usuario("gestionManoObraCif")) {

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

