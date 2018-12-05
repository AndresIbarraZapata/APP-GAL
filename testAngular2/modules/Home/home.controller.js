/**
 * @author: desarrollo web
 */
(function() {
    'use strict';

    angular.module('appRTA')
        .controller('Home', Home);

    Home.$inject = ['parametrosService', '$scope', 'configService', 'loginService', '$timeout', '$location', '$compile', '$cookieStore', '$rootScope', '$templateCache', '$uibModal', 'RTAService', 'modalService', '$constants'];

    function Home(parametrosService, $scope, configService, loginService, $timeout, $location, $compile, $cookieStore, $rootScope, $templateCache, $uibModal, RTAService, modalService, $constants) {
        var vm = $scope;

        vm.init = function() {
            
            //#region Atributos
            $rootScope.img_perfil = configService.variables.Dominio + loginService.UserData.Ruta_FotoPerfil + loginService.UserData.Nombre_FotoPerfil + loginService.UserData.Ext_FotoPerfil;
            $rootScope.usuario_log = (loginService.UserData.NOMBRES_USUARIO + " " + loginService.UserData.APELLIDOS_USUARIO).toLowerCase();
            vm.dominio = configService.variables.Dominio;

            vm.obj_gestion_ordenes_produccion = {
                c_centro_operacion: "",
                d_centro_operacion: ""
            }

            vm.listItemsMenu = [
                {
                    icon_class: "check-square-o",
                    sref: "cotProductoDesarrollado",
                    d_menu: "cotizaciones"
                }
                //{
                //    icon_class: "pencil-square-o",
                //    sref: "cotProductoModificado",
                //    d_menu: "Producto Modificado"
                //},
                //{
                //    icon_class: "plus-square-o",
                //    sref: "cotRegNuevoProducto",
                //    d_menu: "Producto Nuevo"
                //}
            ];

            vm.verificarPerfil = function(opcion) {
               return angular.verficar_perfil_usuario(opcion);
            };

            vm.seleccionar_tipo_barcode = function() {
                $uibModal.open({
                    templateUrl: "frmTipoBarcode.html",
                    backdrop: "static",
                    keyboard: false,
                    controller: "modalFrmTipoBarcode"
                });
            }
            
            function show_frm_cambio_password() {
                $timeout(function() {
                    alertify.success("trinis")
                    $uibModal.open({
                        templateUrl: "cambio_contrasena.html",
                        backdrop: "static",
                        keyboard: false,
                        windowClass: "color_backdrop_modal",
                        //size: "sm",
                        controller: "modalFrmActualizarPass",
                        resolve: {
                            UpdateData: function() {
                                return null //vm.ObjActualizarDatos;
                            }
                        }
                    });
                }, 100);
            };

            /**
             * busca una ip en todas las IP registradas en los puntos de ventas
             * @param ip
             * @returns {boolean}
             */
            function buscar_ip_todos_pv(ip) {
                loginService.punto_venta_ip = null;
                loginService.all_ip_puntosventas.forEach(function(puntoventa) {
                    if (puntoventa.ip_publica == ip) {
                        loginService.punto_venta_ip = puntoventa;
                    }
                });

                return loginService.punto_venta_ip !== null;
            }

            /**
             * busca una ip en todos los puntos de ventas que el usuario tiene configurado
             * @param ip
             * @returns {boolean}
             */
            function buscar_ip_en_sucursales_asociadas_cliente(ip) {
                var sucursalEncontrada = null;

                $rootScope.sucursales.forEach(function (item, index) {
                    if (item.ip_publica === ip) {
                        sucursalEncontrada = item;
                    }
                });

                return sucursalEncontrada;
            }

            function validar_sucursal_usuario() {
                //miramos si la IP que se accede pertenece a una IP pública de la SEDE, en caso positivo la asignamos
                loginService.getIPpublic()
                    .then(function (result) {
                        loginService.IPcliente = result.ip;
                    })
                    .fail(function (error) {
                        var texto_notificacion = 'ocurrió un error obteniendo la IP pública, vuelva a cargar la página';
                        modalService.modalFormNotificacion(texto_notificacion, 'modal-info')
                            .then(function () {
                                loginService.IPcliente = "0.0.0.0";
                                loginService.hasSession = false;
                                $rootScope.mostrarMenu = false;
                                $location.path('/login');
                            }, function () {
                                console.info('Modal dismissed at: ' + new Date());
                            });

                        return;
                    })
                    .always(function () {
                        //traemos todas las ip de los centro de operacion
                        RTAService.getAllIpPorPv()
                            .then(function (result_pv) {
                                var texto_notificacion;

                                if (result_pv.data === undefined || !_.isArray(result_pv.data)) {

                                    texto_notificacion = 'ha ocurrido un error en base de datos, vuelva a cargar la página';
                                    modalService.modalFormNotificacion(texto_notificacion, 'modal-warning')
                                        .then(function () {
                                            loginService.hasSession = false;
                                            $rootScope.mostrarMenu = false;
                                            $location.path('/login');
                                        }, function () {
                                            console.info('Modal dismissed at: ' + new Date());
                                        });

                                    return;
                                }

                                loginService.all_ip_puntosventas = result_pv.data[0];

                                //verificamos si la IP está en un punto de venta
                                if ((loginService.UserData.c_perfil !== $constants.id_perfil_super_admin &&
                                    loginService.UserData.c_perfil !== $constants.id_perfil_admin_produccion &&
                                    loginService.UserData.c_perfil !== $constants.id_perfil_admin_pv) &&
                                    buscar_ip_todos_pv(loginService.IPcliente)) {

                                    //se encuentra en el punto de venta, ahora se procede a verificar si el usuario
                                    //tiene configurado ese punto de venta
                                    var sucursalEncontrada = buscar_ip_en_sucursales_asociadas_cliente(loginService.IPcliente);
                                    if (sucursalEncontrada) {

                                        loginService.all_ip_puntosventas = [];
                                        loginService.UserData.c_centro_operacion_selected = loginService.punto_venta_ip.c_centro_operacion;

                                        loginService.guardarCookie(loginService);

                                    } else {

                                        if ($rootScope.sucursales.length > 0) {

                                            if ($rootScope.sucursales.length === 1) {

                                                loginService.all_ip_puntosventas = [];
                                                loginService.UserData.c_centro_operacion_selected = $rootScope.sucursales[0].c_centro_operacion;

                                                loginService.guardarCookie(loginService);

                                            } else {
                                                modalService.modalFormSeleccionSucursal()
                                                    .then(function (sucursal) {
                                                        loginService.all_ip_puntosventas = [];
                                                        loginService.UserData.c_centro_operacion_selected = sucursal.c_centro_operacion;

                                                        loginService.guardarCookie(loginService);
                                                    });

                                                //TODO: debe permitir seleccionar una de las sucursales configuradas para el usuario.
                                                //texto_notificacion = 'Actualmente se encuentran configurados más de un pv para el usuario, favor comuníquese con sistemas';
                                                //modalService.modalFormNotificacion(texto_notificacion, 'modal-warning')
                                                //    .then(function() {
                                                //        loginService.cerrarSesion();
                                                //    }, function() {
                                                //        console.info('Modal dismissed at: ' + new Date());
                                                //    });

                                                //return;
                                            }

                                        } else {
                                            texto_notificacion = 'actualmente no cuenta con los permisos para acceder al pv ' +
                                                loginService.punto_venta_ip.descripcion +
                                                ', favor comuníquese con sistemas';
                                            modalService.modalFormNotificacion(texto_notificacion, 'modal-warning')
                                                .then(function () {
                                                    loginService.cerrarSesion();
                                                }, function () {
                                                    console.info('Modal dismissed at: ' + new Date());
                                                });

                                            return;
                                        }
                                    }
                                } else {
                                    if ($rootScope.sucursales.length > 0) {

                                        if ($rootScope.sucursales.length === 1) {

                                            loginService.all_ip_puntosventas = [];
                                            loginService.UserData.c_centro_operacion_selected = $rootScope.sucursales[0].c_centro_operacion;
                                            loginService.guardarCookie(loginService);

                                        } else {
                                            modalService.modalFormSeleccionSucursal()
                                                .then(function(sucursal) {
                                                    loginService.all_ip_puntosventas = [];
                                                    loginService.UserData.c_centro_operacion_selected = sucursal.c_centro_operacion;

                                                    loginService.guardarCookie(loginService);
                                                });

                                            //TODO: debe permitir seleccionar una de las sucursales configuradas para el usuario.
                                            //texto_notificacion = 'Actualmente se encuentran configurados más de un pv para el usuario, favor comuníquese con sistemas';
                                            //modalService.modalFormNotificacion(texto_notificacion, 'modal-warning')
                                            //    .then(function() {
                                            //        loginService.cerrarSesion();
                                            //    }, function() {
                                            //        console.info('Modal dismissed at: ' + new Date());
                                            //    });

                                            //return;
                                        }

                                    } else {
                                        texto_notificacion = 'actualmente no cuenta con los permisos para acceder al pv, favor comuníquese con sistemas';
                                        modalService.modalFormNotificacion(texto_notificacion, 'modal-warning')
                                            .then(function () {
                                                loginService.cerrarSesion();
                                            }, function () {
                                                console.info('Modal dismissed at: ' + new Date());
                                            });

                                        return;
                                    }
                                }

                            }).catch(function (error) {
                                toastr.error("ha ocurrido un error en base de datos, vuelva a cargar la página")
                            });
                    });
            }

        
            //#endregion

        };

        //#region Control User Session

        vm.cookieUser = {};
        vm.cookieUser = $cookieStore.get('servlog');

        if (!_.isNull(vm.cookieUser)) {
            if (vm.cookieUser.hasSession && parseInt(vm.cookieUser.UserData.ID_USUARIO) === parseInt(loginService.UserData.ID_USUARIO)) {
                if ($location.$$path == "/Home") {

                    angular.VerificarVersionApp();
                    $rootScope.$$childHead.showmodal = false;

                    vm.init();

                }
            } else {
                $rootScope.$$childHead.showmodal = true;
                $location.path('/login');
            }
        } else {
            $location.path('/login');
            $rootScope.$$childHead.showmodal = true;
        }
        //#endregion
    };
}());

