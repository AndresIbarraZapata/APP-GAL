/**
 * @author: desarrollo web
 */
(function () {
    'use strict';

    angular.module('appRTA')
           .controller('adminUploadArchivos', adminUploadArchivos);

    adminUploadArchivos.$inject = ['parametrosService', '$scope', 'configService', 'loginService', '$timeout', '$location', '$cookieStore', '$rootScope', '$uibModal', 'RTAService', 'modalService', '$constants'];

    function adminUploadArchivos(parametrosService, $scope, configService, loginService, $timeout, $location, $cookieStore, $rootScope, $uibModal, RTAService, modalService, $constants) {
        var vm = $scope;

        function init() {


            vm.swArchivoCargado = 1;
            //CARGAR ARCHIVO CSV 

            $('#submit-file').on("click", function (e) {
                e.preventDefault();
                $('#files').parse({
                    config: {
                        delimiter: "auto",
                        complete: displayHTMLTable,
                    },
                    before: function (file, inputElem) {
                        //console.log("Parsing file...", file);
                    },
                    error: function (err, file) {
                        //console.log("ERROR:", err, file);
                    },
                    complete: function () {
                        //console.log("Done with all files");
                    }
                });
            });

            function displayHTMLTable(results) {

                var table = "<table class='table'>";
                var data = results.data;
                var array = [];
                console.log(results.data);
                vm.arrayDataCostosMdc = [];
                for (var i = 0; i < data.length; i++) {
                    table += "<tr>";
                    var row = data[i];
                    var cells = row.join(",").split(",");
                    array.push(cells)
                    for (var j = 0; j < cells.length; j++) {
                        table += "<td>";
                        table += cells[j];
                        table += "</th>";
                    }
                    table += "</tr>";
                }
                table += "</table>";

                vm.swArchivoCargado = 1;
                //MOSTRAR DATA CARGADA
                $("#parsed_csv_list").html(table);

                //LOGICA ASIGNAR PORIEDADES ARRAY 
                var arrayFinal = [];
                var keyDes = "";

                for (var j = 0; j < array.length; j++) {
                    var arrayDT = array[j];

                    var objXX = {};

                    for (var k = 0; k < arrayDT.length; k++) {

                        if (k === 0) {
                            keyDes = "REFERENCIA";
                        }

                        if (k === 1) {
                            keyDes = "DESCRIPCION";
                        }

                        if (k === 2) {
                            keyDes = "COSTOMDC";
                        }

                        if (k === 3) {
                            keyDes = "UNIMED";
                        }

                        objXX[keyDes] = arrayDT[k];
                    }

                    arrayFinal.push(objXX);
                }
                vm.arrayDataCostosMdc = arrayFinal;
            }


            //FUNCIONES 
            vm.insertarArchivoCostosMdc        = insertarArchivoCostosMdc;
            vm.getCostosProductosInsumosRtaMdc = getCostosProductosInsumosRtaMdc;
            //vm.mostrarDetallearchivoCostos = mostrarDetallearchivoCostos;
            //vm.anularCostoMdc = anularCostoMdc;

            //ARREGLOS
            //vm.arrayDataCostosMdc = [];
            vm.arrayDataUpload = [];
            vm.listaCostosProductosRtaMdc = [];
            vm.listaDetalleCostosMDC = [];

            //vm.arrayDataCostosMdc = [{ "REFERENCIA": "XXX", "DESCRIPCION": "XXXX", "COSTOMDC": "1200" }, { "REFERENCIA": "IMMF0654", "DESCRIPCION": "MINIFIX 8 X 34 15MM", "COSTOMDC": "1000" }, { "REFERENCIA": "HMPLUS30", "DESCRIPCION": "PEGANTE HM PLUS 30 GR (GOTERO)", "COSTOMDC": "1100" }, { "REFERENCIA": "PEREXMIN", "DESCRIPCION": "PERNO EXPANSION MINIFIX", "COSTOMDC": "1200" }, { "REFERENCIA": "B4x8x2", "DESCRIPCION": "BOLSAS EMPAQUE 4x8x2 PEQUENA", "COSTOMDC": "1300" }]


            //OBJETOS
            vm.objHeaderCostosMdc = {

                csIdUsuario: loginService.UserData.ID_USUARIO,
                descripcionArchivo:""
            }


            vm.objHeaderCostosCalculados = {
                pjCambio: "",
                lapsoCorteMes: "",
                tomaMayorMenor: "",
                aumentarDismuir: "",
                flexibilidad: ""
            }

            vm.objanularCostoMdc = {
                cdIdCostos: "",
                csIdUsuario: loginService.UserData.ID_USUARIO
            }

            vm.listaHistoricoCostosMdc = [];
            vm.swAlarmaCostos = false;

            /*
                INSERTAR ARCHIVO COSTOS MDC 
            */
            function insertarArchivoCostosMdc() {

                if (vm.objHeaderCostosMdc.descripcionArchivo === "") {
                    toastr.info('Debe ingresar una descripción para el archivo');
                    return;
                }

                //VALIDAR ARCHIVO CARGADO               
                if (vm.arrayDataCostosMdc.length === 0) {
                    toastr.info('Para guardar debe cargar un archivo');

                    return;
                }


                //ELIMINAR LA PRIMERA POSICION DEL ARRAY
                vm.arrayDataCostosMdc.shift();

                //ELIMINAR LA ULT POSICION DE ARRAY
                vm.arrayDataCostosMdc.pop();

                console.log('ARRAY DATA COSTOS MDC' + vm.arrayDataCostosMdc);

                //OBJETO
                vm.dataCostosMdc =
                {
                    dataHeader: vm.objHeaderCostosMdc,
                    dataDetalle: vm.arrayDataCostosMdc
                }

                //CALL SERVICES
                RTAService.insertarArchivoCostosMdc(vm.dataCostosMdc)
                .then(function (result) {
                    if (result.MSG === "OK") {
                        console.log('Registros almacenados correctamente');
                        toastr.success('Registros almacenados correctamente');

                        swal("REGISTROS ALMACENADOS", "Los registros se guardaron correctamente", "success");
                        vm.objHeaderCostosMdc = {
                            csIdUsuario: loginService.UserData.ID_USUARIO
                        }
                        vm.arrayDataCostosMdc = [];
                        $("#parsed_csv_list").empty();
                        vm.swArchivoCargado = 0;
                    }
                    else {
                        toastr.error(result.MSG);
                        sweetAlert("ERROR", "Ocurrio un error guardando los datos , favor intente de nuevo", "error");
                    }

                });


            }


            /*
                CONSULTAR COTOS PRODUCTOS RTA VS MDC 
            */

            function getCostosProductosInsumosRtaMdc() {

                //vm.objHeaderCostosCalculados = {
                //    pjCambio: "",
                //    lapsoCorteMes: "",
                //    tomaMayorMenor: "",
                //    aumentarDismuir: "",
                //    flexibilidad: ""
                //}

                if (vm.objHeaderCostosCalculados.pjCambio === "") {
                    toastr.info('Debe ingresar un % de cambio');
                    return;
                }


                if (vm.objHeaderCostosCalculados.flexibilidad === "") {
                    toastr.info('Debe ingresar la flexibilidad');
                    return;
                }


                vm.listaCostosProductosRtaMdc = [];
                vm.objectDialog.LoadingDialog("...");
                RTAService.getCostosProductosInsumosRtaMdc()
                    .then(function (data) {
                     
                        if (data.data.length > 0 && data.data[0].length > 0) {
                            vm.objectDialog.HideDialog();
                            vm.listaCostosProductosRtaMdc = data.data[0];

                            vm.listaCostosProductosRtaMdc.forEach(function (item) {

                                //SI EL COSTO MDC ES MAYOR SE COLOCA SINO SE COLOCA EL DE RTA
                                //if (item.COSTO_MDC > item.COSTO_RTA) {
                                //    item.MAYOR_VALOR = item.COSTO_MDC;
                                //} else {
                                //    item.MAYOR_VALOR = item.COSTO_RTA;
                                //}

                                if (vm.objHeaderCostosCalculados.tomaMayorMenor === 'M') {

                                    if (item.COSTO_MDC > item.COSTO_RTA) {
                                        item.MAYOR_VALOR = item.COSTO_MDC;
                                    } else {
                                        item.MAYOR_VALOR = item.COSTO_RTA;
                                    }
                                } else {
                                    if (item.COSTO_MDC < item.COSTO_RTA) {
                                        item.MAYOR_VALOR = item.COSTO_MDC;
                                    } else {
                                        item.MAYOR_VALOR = item.COSTO_RTA;
                                    }
                                }

                                if (vm.objHeaderCostosCalculados.tomaMayorMenor === 'P') {

                                    item.MAYOR_VALOR = (item.COSTO_MDC + item.COSTO_RTA) / 2;

                                }


                                //cALCULAR VARIACIÓN PORCENTUAL 
                                if (item.COSTO_MDC === 0) {
                                    item.VARIACION = 0;
                                } else {
                                    item.VARIACION = (((item.COSTO_MDC - item.COSTO_RTA) / item.COSTO_RTA) * 100).toFixed(2);
                                }
                               
                               

                                //ASIGNAR COSTO FINAL 

                                if (item.VARIACION > parseFloat(vm.objHeaderCostosCalculados.pjCambio) || item.VARIACION > parseFloat(vm.objHeaderCostosCalculados.flexibilidad)) {
                                    item.SW_ALERTA = 1;
                                    item.COSTO_FINAL_RTA = item.MAYOR_VALOR;
                                    vm.swAlarmaCostos = true;

                                } else {
                                    item.COSTO_FINAL_RTA = item.MAYOR_VALOR + item.MAYOR_VALOR * (parseFloat (vm.objHeaderCostosCalculados.pjCambio) / 100);
                                    item.SW_ALERTA = 0;
                                }

                               

                            });
                        }
                        else {
                            //vm.objectDialog.HideDialog();
                            toastr.error("Ocurrió un error al tratar de obtener los últimos costos de insumos");
                        }
                    });
            }


            vm.objUpdateCostosMdc = {
                cdIdCosto: "",
                valorCosto: "",
                unidadMededida: "",
                observacion: ""
            }

            vm.openUpdateArchivoCostosMdc = function (item) {
                //toastr.info('Entra!!');

                vm.objUpdateCostosMdc.cdIdCosto = item.CS_ID_MV;
                vm.objUpdateCostosMdc.valorCosto = item.COSTO_MDC;
                vm.objUpdateCostosMdc.unidadMededida = item.UNIDAD_MEDIDA_MDC;
                 
                angular.element(document).ready(function () {
                    $("#modal-update-costo-mdc").modal(
                        { 
                            show: true,
                            backdrop: 'static',
                            keyboard: false
                        });
                });



            }


            vm.updateArchivoCostosMdc = function () {


                if (vm.objUpdateCostosMdc.valorCosto === "") {
                    toastr.info('Debe ingresar el valor costo MDC');
                    return;
                }
                if (vm.objUpdateCostosMdc.unidadMededida === "") {
                    toastr.info('Debe ingresar una UNIDAD DE MEDIDA');
                    return;
                }
      

                RTAService.updateArchivoCostosMdc(vm.objUpdateCostosMdc)

                .then(function (result) {

                    if (result.MSG === "OK") {
                        console.log('Registros actualizados correctamente');

                        swal("DATOS actualizados", "Se actualizo el costo correctamente", "success");
                        vm.swUpdate = 0;
                        //limpiar data
                    

                        getCostosProductosInsumosRtaMdc();

                    }
                    else {

                        toastr.warning(result.MSG);
                        sweetAlert("ERROR", "No se actualizaron los datos", "error");
                    }

                });


                
            }


            vm.inserCostosCalculados=function() {
                swal("Datos almacenados correctamente", "", "success");
                vm.listaCostosProductosRtaMdc = [];
                vm.objHeaderCostosCalculados = {
                    pjCambio: "",
                    lapsoCorteMes: "",
                    tomaMayorMenor: "",
                    aumentarDismuir: "",
                    flexibilidad: ""
                }

            }

            //getCostosProductosInsumosRtaMdc();


            vm.verModalCostosMdc= function() {

                modalService.modalFormBuscarCostosMdc()
                    .then((costos) => {
                        console.log("costos mdc", costos);
                        //limpiar_formulario();

                        //vm.obj_encabezado_cotizacion.documento_cliente = cotizacion.DOCUMENTO_CLIENTE;
                        //vm.obj_encabezado_cotizacion.nombres_cliente = cotizacion.NOMBRES_CLIENTE;
                        //vm.obj_encabezado_cotizacion.apellidos_cliente = cotizacion.APELLIDOS_CLIENTE;
                        //vm.obj_encabezado_cotizacion.fecha_cotizacion = cotizacion.FECHA_COTIZACION;
                        //$('#dpFechaCotizacion').data("DateTimePicker").date(moment(cotizacion.FECHA_COTIZACION));

                        //vm.obj_encabezado_cotizacion.tipo_cotizacion = cotizacion.TIPO_COTIZACION;
                        //vm.obj_encabezado_cotizacion.cs_cotizacion = cotizacion.CS_TIPO_COTIZACION;
                        //vm.obj_encabezado_cotizacion.cs_h_cotizacion = cotizacion.CS_ID_COTIZACION;
                        //vm.obj_encabezado_cotizacion.ESTADO_COTIZACION = cotizacion.ESTADO_COTIZACION;
                        //vm.obj_encabezado_cotizacion.email = cotizacion.EMAIL_CLIENTE;

                        //if (cotizacion.listaDetalleCotizacion.length > 0) {
                        //    vm.list_productos_seleccionados = cotizacion.listaDetalleCotizacion;
                        //    vm.swMostrarItems = true;
                        //    angular.activarFancybox();
                        //}

                        $timeout(() => {
                            vm.$apply();
                        }, 0);
                    });
            }



        };//FIN INIT()


        vm.cookieUser = {};
        vm.cookieUser = $cookieStore.get('servlog');

        if (!_.isNull(vm.cookieUser)) {
            if (vm.cookieUser.hasSession && parseInt(vm.cookieUser.UserData.ID_USUARIO) === parseInt(loginService.UserData.ID_USUARIO)) {
                if ($location.$$path == "/adminUploadArchivos" && angular.verficar_perfil_usuario("adminUploadArchivos")) {

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

