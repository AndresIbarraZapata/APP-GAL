/**
 * @author: Jose Daniel Estrada Pulgarin.
 * @email : jdanielestrada18@gmail.com
 * @github: github.com/jdanielestrada
 */
(function () {
    'use strict';

    angular
        .module('appRTA')
        .controller('UserLogin', UserLogin);

    UserLogin.$inject = ['$scope', 'loginService', '$constants'];

    function UserLogin($scope, loginService, $constants) {
        var vm = $scope;

        vm.Error = {
            value: false
        };

        vm.loginServicetmp = {};
        vm.credentials = {
            usuario: "",
            password: ""
        };

        vm.login = function(credentials) {
            vm.Error.value = false;
            if (vm.credentials.usuario != "" && vm.credentials.password != "") {
                vm.logearUsuario(credentials);
                vm.credentials.password = "";
            } else {
                vm.Error.value = true;

                if (vm.credentials.usuario == "") {
                    vm.credentials.password = '';
                    toastr.error("Ingrese un correo.");
                    return;
                }

                if (vm.credentials.password == "") {
                    toastr.error("Ingrese una contrase&ntilde;a.");
                    return;
                }
            }
        };

        vm.logearUsuario = function(credenciales) {
            vm.showSpinner = true;
            
            loginService.login(credenciales)
                .then(function(result) {

                    vm.showSpinner = false;
                    result = result.data;

                    if (result.MSG === "OK") {

                        loginService.hasSession = true;

                        if (result.data[0].length > 0) {
                            _.extend(loginService.UserData, result.data[0][0]);

                            loginService.guardarCookie(loginService);
                            //en logeo exitoso traemos las sucursales
                            loginService.loadSession();
                        } else {
                            toastr.error("La combinaci&oacute;n de correo y contrase&ntilde;a no es correcta.");
                        }
                    } else {
                        toastr.error(result.MSG);
                    }

                }).catch(function(data) {
                    toastr.error("Error de protocolo HTTPS &oacute; de la conexion de la web api");
                });
        };
    }
})();
