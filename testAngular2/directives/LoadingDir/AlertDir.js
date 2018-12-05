(function () {

    'use strict';

    angular.module('appRTA')
           .directive('alertdialog', ['$timeout', '$location', function ($timeout, $location) {
        return {
            scope: {
                getdata: '&',
                canceldata: '&',
                control: '='
            },
            restrict: 'E',
            templateUrl: 'directives/LoadingDir/AlertDir.html',
            link: function (scope, element, attr) {
              
                // definición para permitir acceso a metodos dentro del isolated scope 
                // two way binding de un objeto donde se declaran funciones internas
                scope.internalControl = scope.control || {};
                scope.MsgText = {
                    value: ""
                };

                scope.result = {
                    valor: false,
                    funcion: ""
                };

                //Abre una alerta de confirmacion , declarar el metodo ConfirmResult(value) donde value es true si se da click en si y false si se da click en no
                scope.internalControl.ShowConfirm = function (MessageDialog, functoexecute) {
                    scope.MsgText.value = MessageDialog;
                    scope.result.funcion = functoexecute;
                    scope.Dialog = true;
                    scope.ButtonYesNo = true;
                    scope.LoadingDialog = false;
                    scope.RedirectButton = false;
                    scope.AccepButton = false;
                    scope.CancelButton = false;
                };

                //Metodo para llamar un alert.
                scope.internalControl.AlertDialog = function (MessageDialog) {
                    scope.MsgText.value = MessageDialog;
                    scope.Dialog = true;
                    scope.AccepButton = true;
                    scope.ButtonYesNo = false;
                    scope.LoadingDialog = false;
                    scope.RedirectButton = false;
                    scope.CancelButton = false;
                };

                //Abre un dialogo animado
                scope.internalControl.LoadingDialog = function (MessageDialog) {
                    scope.MsgText.value = MessageDialog;
                    scope.Dialog = true;
                    scope.LoadingDialog = true;
                    scope.AccepButton = false;
                    scope.ButtonYesNo = false;
                    scope.RedirectButton = false;
                    scope.CancelButton = false;
                };

                //Abre un dialogo animado
                scope.internalControl.LoadingDialogCancel = function (MessageDialog, MessageRedirect) {
                    scope.MsgText.value = MessageDialog;
                    scope.Dialog = true;
                    scope.CancelButton = true;
                    scope.LoadingDialog = true;
                    scope.AccepButton = false;
                    scope.ButtonYesNo = false;
                    scope.RedirectButton = false;
                    scope.linkMgsRedirect = MessageRedirect;
                };

                //Abre un alert co un boton para redirrecionar a algun link.
                scope.internalControl.RedirectDialog = function (MessageDialog, MessageRedirect) {
                    scope.MsgText.value = MessageDialog;
                    scope.Dialog = true;
                    scope.RedirectButton = true;
                    scope.linkMgsRedirect = MessageRedirect;
                    //scope.linkRedirect = LinkRedirect;
                    scope.LoadingDialog = false;
                    scope.AccepButton = false;
                    scope.ButtonYesNo = false;
                    scope.CancelButton = false;
                };

                //Esconde el dialogo animado
                scope.internalControl.HideDialog = function () {
                    scope.Hide();
                };

                //esconde el alert.
                scope.Hide = function () {
                    scope.Dialog = false;
                };

                //Función para cancelar los llamados a la api cuando se bloquea por demora
                scope.Apagar = function () {
                    //$location.path(scope.RutaRedirect.value);
                    //$route.reload();
                    scope.Dialog = false;
                    scope.canceldata();
                };

                //retorna un bool cuando se le da si en un showconfirmdialog
                scope.SelectedConfirm = function (value) {
                    scope.Dialog = false;
                    scope.getdata({ valor: value, funcion: angular.copy(scope.result.funcion) });
                };


            }//end link function
        };
    }]);


}());