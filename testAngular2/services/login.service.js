(function () {

    'use strict';

    angular.module('appRTA')
           .factory('loginService', [
            '$rootScope', '$http', 'configService', '$timeout', '$location', '$cookieStore', '$state', 'RTAService',
            function ($rootScope, $http, configService, $timeout, $location, $cookieStore, $state, RTAService) {

                var loginService = {};
                loginService.UserData = {
                    c_centro_operacion_selected: null
                };
                
                $rootScope.sucursales = [];

                loginService.hasSession = false;

                loginService.cerrarSesion = function () {
                    $cookieStore.remove('servlog');
                    loginService.hasSession = false;
                    $rootScope.mostrarMenu = false;
                    $location.path('/login');

                    $timeout(function() {
                        window.location.reload();
                    }, 5);
                };

                loginService.verificarsession = function(UserData) {
                    return false;
                };

                loginService.login = function (credenciales) {
                    return $http.post(configService.ApiUrls.UrlGestionCotizaciones + "get_autenticar_ususario", JSON.stringify(credenciales));
                };

                loginService.isSession = function () {
                    return !_.isUndefined($cookieStore.get('servlog'));
                };
                
                loginService.guardarCookie = function (loginServiceToSave) {
                    $cookieStore.put("servlog", loginServiceToSave);
                    $rootScope.mostrarMenu = true;
                };

                loginService.getSession = function () {
                    return _.extend(loginService, $cookieStore.get('servlog'));
                };

                loginService.loadSession = function () {

                    var loginServicetmp = loginService.getSession();
                    loginService = angular.copy(loginServicetmp);
                    loginService.hasSession = true;
                    
                    $rootScope.mostrarMenu = true;
                    $location.path('/Home');
                    
                    //RTAService.getSucursales(loginService.UserData.cs_IdUsuario, 1) //$rootScope.idCompania)
                    //    .then(function (resultSucursales) {
                    //        if (resultSucursales.data === undefined || !_.isArray(resultSucursales.data)) {
                    //            return toastr.error("ha ocurrido un error en base de datos, vuelva a cargar la página", resultSucursales);
                    //        }
                    //        $rootScope.sucursales = resultSucursales.data[0];
      
                    //        //guarda la referencia del elemento en la cookie para referencias más adelantes
                    //        //loginService.guardarCookie(loginService.userData);
                    //        $rootScope.mostrarMenu = true;
                    //        $location.path('/Home');

                    //        //siempre vamos al home si no hay una query path returnurl={...}
                    //        //var querystringReturnUrl = $location.search().returnurl;
                    //        //if (querystringReturnUrl != undefined &&
                    //        //    querystringReturnUrl != null &&
                    //        //    querystringReturnUrl != true) {
                    //        //    $location.path(querystringReturnUrl);
                    //        //} else {
                    //        //    $state.go('home');
                    //        //}
                    //    })
                    //    .catch(function (errSucursales) {
                    //        toastr.warning(errSucursales);
                    //    });
                };

                loginService.leerCookie = function () {

                   var loginServicetmp = $cookieStore.get('servlog');

                    if (!_.isUndefined(loginServicetmp)) {

                        if (!_.isUndefined(loginServicetmp.hasSession)) {

                            loginService.UserData = angular.copy(loginServicetmp.UserData);
                            loginService.hasSession = loginServicetmp.hasSession;
                            $rootScope.mostrarMenu = true;
                        }
                    }
                };

                /**
                 * fuente: https://www.ipify.org/
                 * @return {[type]} [description]
                 */
                loginService.getIPpublic = function () {
                    return $.getJSON("https://api.ipify.org?format=json");
                };

                return loginService;
            }
        ]);
}());