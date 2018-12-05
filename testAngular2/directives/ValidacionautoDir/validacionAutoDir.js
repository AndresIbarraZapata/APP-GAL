(function () {

    'use strict';

    /*
      Validacion inmediata de campos tipo text
      ejemplo llamar la directiva asi x-validacion-auto="upper|solo_letras"
      las opciones de validacion separadas por pipe se ejecutan en el mismo orden
    
    */
    angular.module('appRTA')
.directive('validacionAuto', function ($parse) {
    return {
        require: 'ngModel',
        link: function (scope, iElement, attrs, modelCtrl) {

            var frm_jsvalcadena = function (valor, cadval) {
                var i, j, aux = '';
                for (i = 0; i < valor.length; i++) {
                    for (j = 0; j < cadval.length; j++) {
                        if (valor.charCodeAt(i) == cadval.charCodeAt(j)) {
                            aux = aux + valor.charAt(i);
                            j = cadval.length + 20;
                        }
                    }
                }

                return aux;
            };

            // Agregar funciones aqui 
            // ==================================
            var val_trim = function (a_valor) {
                return a_valor.replace(/^\s+|\s+$/g, "");
            };
            // *************************************************
            var evaluar_tipo = function (a_tipo, a_valor, a_param) {
                a_tipo = angular.lowercase(a_tipo);
                var l_val = "", l_valaux = "";

                switch (a_tipo) {
                    case 'trim':
                        l_valaux = val_trim(a_valor);
                        break;
                    case 'upper':
                        l_valaux = a_valor.toUpperCase();
                        break;
                    case 'upper_first':
                        l_valaux = a_valor.charAt(0).toUpperCase() + a_valor.substring(1);
                        break;
                    case 'smallint':
                    case 'integer':
                    case 'int':
                    case 'numero':
                        l_valaux = frm_jsvalcadena(a_valor, '-0123456789,.');
                        var a = 1;
                        break;
                    case 'decimal':
                        l_valaux = frm_jsvalcadena(a_valor, ',.0123456789');
                        if (l_valaux.substring(0, 1) == '.') l_valaux = '0' + l_valaux;
                        break;
                    case 'date':
                        l_valaux = frm_jsvalcadena(a_valor, '/-0123456789');
                        break;
                    case 'email':
                        l_val = 'abcdefghijklmnopqrstuvwxyzñ';
                        l_val = l_val + l_val.toUpperCase();
                        l_val = l_val + '-0123456789';
                        l_val = l_val + '@_.';
                        l_valaux = frm_jsvalcadena(a_valor, l_val);
                        break;
                    case 'dominio':
                        l_val = 'abcdefghijklmnopqrstuvwxyzñ';
                        l_val = l_val + l_val.toUpperCase();
                        l_val = l_val + '-0123456789';
                        l_val = l_val + '_.';
                        l_valaux = frm_jsvalcadena(a_valor, l_val);
                        break;
                    case 'solo_texto':
                        l_val = 'abcdefghijklmnopqrstuvwxyzñ';
                        l_val = l_val + l_val.toUpperCase();
                        l_val = l_val + '+-=<>*/0123456789.';
                        l_val = l_val + ' ¿¡?!@#$%&()[]{}:.,;_';
                        l_valaux = frm_jsvalcadena(a_valor, l_val);
                        break;
                    case 'solo_letras':
                        l_val = 'abcdefghijklmnopqrstuvwxyzñ';
                        l_val = l_val + l_val.toUpperCase();
                        l_val = l_val + ' ';
                        l_valaux = frm_jsvalcadena(a_valor, l_val);
                        break;
                    case 'solo_numeros':
                        l_val = '0123456789';
                        l_valaux = frm_jsvalcadena(a_valor, l_val);
                        l_valaux = val_trim(l_valaux);
                        break;
                    case 'letras_numeros':
                        l_val = 'abcdefghijklmnopqrstuvwxyzñ';
                        l_val = l_val + l_val.toUpperCase();
                        l_val = l_val + "0123456789";
                        l_valaux = frm_jsvalcadena(a_valor, l_val);
                        break;
                    case 'direccion':
                        l_val = 'abcdefghijklmnopqrstuvwxyzñ';
                        l_val = l_val + l_val.toUpperCase();
                        l_val = l_val + '0123456789';
                        l_val = l_val + ' -_.';
                        l_valaux = frm_jsvalcadena(a_valor, l_val);
                        break;
                    case 'formato_factura':
                        l_val = '0123456789';
                        l_val = l_val + '-';
                        l_valaux = frm_jsvalcadena(a_valor, l_val);
                        break;
                    case 'porcentaje':
                        l_valaux = frm_jsvalcadena(a_valor, ',.0123456789');
                        if (l_valaux.substring(0, 1) == '.') l_valaux = '0' + l_valaux;
                        break;
                }

                return l_valaux;
            };

            // *************************************************

            var iniciar = function (inputValue) {

                var l_valor = "";
                var l_cadOpt = attrs.validacionAuto;

                if (inputValue == NaN || inputValue == null || inputValue.length <= 0) inputValue = "";
                if (l_cadOpt.length <= 0) l_cadOpt = 'upper';

                var l_vOpt = l_cadOpt.split("|");

                l_valor = inputValue;
                l_vOpt.forEach(function (l_opcion) {

                    l_valor = evaluar_tipo(l_opcion, l_valor, '');

                });

                if (l_valor !== inputValue) {
                    modelCtrl.$setViewValue(l_valor);
                    modelCtrl.$render();
                }

                return l_valor;
            };

            modelCtrl.$parsers.push(iniciar);
            iniciar($parse(attrs.ngModel)(scope)); // iniciar value

        }
    };

});//fin directive

}());// fin strict
