(function() {
    'use strict';
    angular.module('appRTA')
           .directive('loginControl', loginControl);

    loginControl.$inject = ['loginService', '$location', '$http', 'configService', '$rootScope', '$cookieStore', '$state', 'RTAService', '$constants'];

    function loginControl(loginService, $location, $http, configService, $rootScope, $cookieStore, $state, RTAService, $constants) {

        return {

            restrict   : 'A',
            templateUrl: 'directives/LoginDir/LoginDirective.html',
            link: function(scope, elemto, attrs) {
                var vm = scope;

                toastr.options = {
                    "closeButton"      : true,
                    "debug"            : false,
                    "newestOnTop"      : false,
                    "progressBar"      : false,
                    "positionClass"    : "toast-top-left",
                    "preventDuplicates": true,
                    "onclick"          : null,
                    "showDuration"     : "300",
                    "hideDuration"     : "1000",
                    "timeOut"          : "5000",
                    "extendedTimeOut"  : "1000",
                    "showEasing"       : "swing",
                    "hideEasing"       : "linear",
                    "showMethod"       : "fadeIn",
                    "hideMethod"       : "fadeOut"
                }

               vm.objectDialog = {};

               vm.Error = {
                    value: false
                };

                $rootScope.log_usuario = {
                    nombre: "",
                    cargo: ""
                };

                vm.leerCookie = function () {

                    vm.loginServicetmp = $cookieStore.get('servlog');

                    if (!angular.isUndefined(vm.loginServicetmp)) {

                        if (!angular.isUndefined(vm.loginServicetmp.hasSession)) {

                            loginService.UserData = angular.copy(vm.loginServicetmp.UserData);
                            loginService.hasSession = vm.loginServicetmp.hasSession;
                            $rootScope.mostrarMenu = true;
                            vm.$parent.$$childHead.valido = true;
                        }
                    }
                };

               vm.loginServicetmp = {};
               vm.leerCookie();

                if (!loginService.hasSession) {
                   vm.result = {};
                    vm.credentials = {
                        username: 'jose.estrada@madecentro.co',
                        password: '1'
                    };

                    vm.Forgot = {
                        username: '',
                        email: ''
                    };

                    if (!loginService.hasSession) {

                        $rootScope.DominioApp = {
                            value: ""
                        };

                        if (/ForgotPassword/.test($location.$$url)) {
                            vm.showmodal = false;
                            $rootScope.mostrarMenu = true;
                            vm.$parent.$$childHead.valido = true;
                        } else {
                            vm.showmodal = true;
                            vm.showlogin = true;
                        }
                    }

                    vm.login = function(credentials) {
                        vm.Error.value = false;
                        vm.objectDialog.LoadingDialog('Ingresando...');
                        if (vm.credentials.username != "" && vm.credentials.password != "") {
                            vm.logearUsuario(credentials);
                            vm.credentials.password = "";
                        } else {
                            vm.objectDialog.HideDialog();
                            vm.Error.value = true;
                            if (vm.credentials.password == "") {
                                vm.msgLogin = "Ingrese una contraseña";
                            }

                            if (vm.credentials.username == "") {
                                vm.credentials.password = '';
                                vm.msgLogin = "Ingrese un correo";
                            }
                        }
                    };
                    vm.logearUsuario = function (credenciales) {
                        credenciales.idAplicacion = $constants.id_aplicacion;
                        $http.post(configService.ApiUrls.UrlGestionProduccion + "login", JSON.stringify(credenciales), {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function(result) {
                            console.log('valor del result.Msg ' + result.data.MSG);
                            if (result.data.MSG == "OK") {
                                loginService.UserData.DominioApp = configService.variables.Dominio;

                                if (result.data.data.length > 0) {

                                    loginService.hasSession = true;
                                    loginService.UserData.cs_IdUsuario      = result.data.data[0][0].cs_IdUsuario;
                                    loginService.UserData.cedula            = result.data.data[0][0].cedula;
                                    loginService.UserData.Usuario           = result.data.data[0][0].Usuario,
                                    loginService.UserData.PrimerApellido    = result.data.data[0][0].PrimerApellido,
                                    loginService.UserData.PrimerNombre      = result.data.data[0][0].PrimerNombre,
                                    loginService.UserData.UserName          = result.data.data[0][0].UserName,
                                    loginService.UserData.Nombre_FotoPerfil = result.data.data[0][0].Nombre_FotoPerfil;
                                    loginService.UserData.Ext_FotoPerfil    = result.data.data[0][0].Ext_FotoPerfil;
                                    loginService.UserData.Ruta_FotoPerfil   = result.data.data[0][0].Ruta_FotoPerfil;
                                    loginService.UserData.id_calendario     = result.data.data[0][0].id_calendario;
                                    loginService.UserData.c_perfil          = result.data.data[0][0].c_perfil;
                                    loginService.UserData.sw_cambiar_clave  = result.data.data[0][0].sw_cambiar_clave;

                                    loginService.UserData.c_centro_operacion_selected = null;

                                    vm.guardarCookie();

                                    vm.showmodal                       = false;
                                    $rootScope.mostrarMenu = true;
                                    vm.$parent.$$childHead.valido      = true;
                                    vm.objectDialog.HideDialog();

                                    //if ($location.$$url == "/")
                                        $state.go("home");
                                    //else
                                    //    $location.path($location.$$url);

                                } else {
                                    vm.objectDialog.HideDialog();
                                    toastr.error("La combinación de correo y contraseña no es correcta.");
                                    $rootScope.$$childHead.showmodal = true;
                                }
                            } else {
                                vm.objectDialog.HideDialog();
                                toastr.error(result.data.MSG);
                            }

                        }).catch(function(data) {
                            vm.objectDialog.HideDialog();
                            toastr.error("Error de protocolo HTTPS ó de la conexion de la web api");
                            $rootScope.$$childHead.showmodal = true;
                        });
                    };
                    vm.ForgotPasswd = function () {
                        vm.showlogin = false;
                    };
                    vm.Cancel = function () {
                        vm.Error.value = false;
                        vm.showlogin = true;
                    };

                    //Olvido Contrasena
                    vm.RecuperarPass = function () {
                        vm.showlogin        = false;
                        vm.frmRecuperarPass = true;
                    };
                    vm.CancelarRecuperarPass = function () {
                        vm.showlogin        = true;
                        vm.frmRecuperarPass = false;
                    };
                    vm.Accept = function (forgot) {
                        if (forgot.email) {
                            vm.objectDialog.LoadingDialog("...");

                            RTAService.forgotPassword(forgot)
                                .then(function(data) {
                                    vm.objectDialog.HideDialog();

                                    if (data.Msg === "Correo Enviado") {
                                        vm.showlogin        = true;
                                        vm.frmRecuperarPass = false;
                                        toastr.info("Se envió un correo a la cuenta " + forgot.email + " pidiendo su confirmación, con el fin de continuar con el proceso.");

                                    } else {
                                        toastr.warning(data.Msg);
                                    }
                                });
                        } else {
                            toastr.error("Ingrese su email...");
                        }
                    };
                    vm.RegistroUser = function () {
                        $location.path('/registoUsr');
                    };

                } else {
                    vm.showmodal = false;
                    $state.go("home");
                }

                vm.guardarCookie = function() {
                    var hora = 1000 * 60 * 60; //1hora
                    var timeoutExpireSession = hora;

                    $cookieStore.put('servlog', loginService);

                    //$cookieStore.put('servlog', loginService,
                    //{
                    //    expires: new Date(moment().add(timeoutExpireSession, "ms"))
                    //});
                };
            }
        };
    };
}());
