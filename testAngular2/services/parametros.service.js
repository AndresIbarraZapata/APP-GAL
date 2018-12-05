/**
 * @author: desarrollo web
 */
(function () {
    "use strict";

    angular
        .module('appRTA')
        .factory('parametrosService', parametros);

    parametros.$inject = ['$log', 'RTAService', '$rootScope', 'loginService'];

    function parametros($log, RTAService, $rootScope) {

        var servicio = {};
        //lista que adiciona los parámetros necesarios para funcionar SAM
        //se debe obtener los valores de MPARAMETROS
        servicio.objectLiteralMPARAMETROS = [
            "POS_ESTADO_OP_APROBADA",
            "POS_ESTADO_OP_RECHAZADA",
            "POS_ESTADO_EDICION_OP",
            "POS_ESTADO_OP_PROGRAMADA",
            "POS_GRUPO_SERVICIOS_ENCHAPE",
            "POS_GRUPO_SERVICIOS_CORTE",
            "POS_GRUPO_SERVICIOS_OTROS",
            "PROD_MIN_ADD_TIEMPO_INICIO_OPE_MAQ",
            "PROD_TIEMPO_VENCIMIENTO_PICKING_OP_DANGER",
            "PROD_TIEMPO_VENCIMIENTO_PICKING_OP_WARNING",
            "PROD_ESTADO_OP_PICKING",
            "GH_ID_CARGO_OPERARIO_MAQUINA",
            "PROD_ESTADO_OP_PICKING_PARCIAL",
            "PROD_ESTADO_OP_PICKING",
            "PROD_ESTADO_DT_OP_PENDIENTE",
            "PROD_ESTADO_DT_OP_INICIADO",
            "PROD_ESTADO_DT_OP_TERMINADO",
            "PROD_ESTADO_OP_COMPLETADO",
            "PROD_ESTADO_OP_ANULADO",
            "PROD_TIEMPO_LIMITE_ETAPA_CERRADA_CAMBIO_PJ",
            "SIESA_CABECERA_IMPORTAR",
            "MTO_ID_ESTADO_MAQUINA_OPERATIVA_PROBLEMAS",
            "MTO_ID_ESTADO_MAQUINA_NO_OPERATIVA",
            "PROD_MIN_ADD_TIEMPO_INICIO_OPE_MAQ_DEP",
            "PROD_ID_GRUPO_SERVICIO_SERV_ESPECIALES", 
            "PROD_MIN_ADD_TIEMPO_DISPONIBILIDAD_MAQ",
            "PROD_ESTADO_OP_ENTREGADO_CLIENTE",
            "MTO_ID_NOVEDAD_MAQUINA_SIN_OPERAR",
            "MTO_ID_AREA_MTTO",
            "MTO_ID_TIPOLOGIA_NOVEDAD_MAQUINA",
            "PROD_MOT_SUSP_MAQ_PARADA",
            "PROD_ID_GRUPO_SERVICIO_ZUNCHADO",
            "MTO_ID_ESTADO_MAQUINA_MTTO_PREVENTIVO"
        ];

        //M_PARAMETROS
        servicio.MPARAMETROS = {

        };
        //tipos de documentos
        servicio.TiposDocumentoArray = [];

        servicio.updateConfiguracionMparametros = function () {
            //unimos el object literal para enviarlo como lista separados con comma (,)
            var listaParametros = servicio.objectLiteralMPARAMETROS.join(",");
            servicio.MPARAMETROS = {};

            RTAService.getParametrosMulti(listaParametros)
                .then(function (parametros) {
                    if (parametros.data == null) {
                        toastr.error("no se pudo conectar a la base de datos, vuelva a recargar la página");
                        $rootScope.showMenuByErrorHttp = false;
                        return;
                    }
                    if (parametros !== undefined && parametros.data !== undefined && parametros.data.length > 0) {
                        parametros.data[0].forEach(function (parametro) {
                            servicio.MPARAMETROS[parametro.c_parametro] = parametro.vr_parametro;
                        });
                        servicio.MPARAMETROS["idCIA"] = 1;
                    }
                })
               .catch(function () {
                   $rootScope.showMenuByErrorHttp = false;
               });
        };

        return servicio;
    }
})();

