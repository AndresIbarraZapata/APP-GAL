/**
 * @author: desarrollo web
 */
(function () {
    "use strict";

    angular
      .module('appRTA')
      .factory('RTAService', RTAService);

    RTAService.$inject = ['$http', 'configService', '$rootScope'];

    function RTAService($http, configService, $rootScope) {
        return {

            getInformacioncliente: getInformacioncliente,
            generarConsecutivoCotizacion: generarConsecutivoCotizacion,
            insertEncabezadoCotizacion: insertEncabezadoCotizacion,
            insertProductosCotizacion: insertProductosCotizacion,
            getCotizacionesByUsusario: getCotizacionesByUsusario,
            getDetalleCotizacion: getDetalleCotizacion,
            updateEstadoHCotizaciones: updateEstadoHCotizaciones,
            getProductosDesarrollados: getProductosDesarrollados,

            getParametrosMulti: getParametrosMulti,
            getOpsForGestionOperarioExtraLaboral: getOpsForGestionOperarioExtraLaboral,
      
            getMaterialesProductosDesarrollados: getMaterialesProductosDesarrollados,



            deleteProductoDtCotizacion: deleteProductoDtCotizacion,
            insertarArchivoCostosMdc: insertarArchivoCostosMdc,
   
            getInsumosByProductoCotizacion: getInsumosByProductoCotizacion,
            editarProductoDtCotizacion: editarProductoDtCotizacion,
            getCostosProductosInsumosRtaMdc: getCostosProductosInsumosRtaMdc,
            updateArchivoCostosMdc: updateArchivoCostosMdc,
            getHistoricoCostosMdc: getHistoricoCostosMdc,
            anularCostoMdc: anularCostoMdc,
            getDetallearchivoCostos: getDetallearchivoCostos,
            getProductosDesarrolladosForGestionImagen: getProductosDesarrolladosForGestionImagen,
            getAllMaterialesProductosDesarrollados: getAllMaterialesProductosDesarrollados,
            insertEspesores: insertEspesores,
            insertManoObra: insertManoObra,
            
            insertNuevoProducto: insertNuevoProducto,
            generaPdfCotizacion: generaPdfCotizacion
        };

        function generaPdfCotizacion(request) {
            return $http.post(configService.ApiUrls.UrlGestionCotizaciones + "generarpdfcotizacion",
                    JSON.stringify({
                        "template": request.htmlToPdf,
                        nombre_archivo: request.nombre_archivo
                    }))
                .then(generaPdfCotizacionComplete)
                .catch(generaPdfCotizacionFailed);

            function generaPdfCotizacionComplete(response) {
                return response.data;
            }

            function generaPdfCotizacionFailed(error) {
                toastr.error('XHR falló en generaPdfCotizacion', error);
                return error;
            }
        }

        function getInformacioncliente(documentoCliente) {
            return $http.get(configService.ApiUrls.UrlGestionCotizaciones + "get_informacion_cliente/" + documentoCliente)
                .then(getInformacionclienteComplete)
                .catch(getInformacionclienteFailed);

            function getInformacionclienteComplete(response) {
                return response.data;
            }

            function getInformacionclienteFailed(error) {
                toastr.error('XHR falló en getInformacioncliente', error);
                return error;
            }
        }



        function generarConsecutivoCotizacion(tipo_cotizacion, idUsuario) {
            return $http.post(configService.ApiUrls.UrlGestionCotizaciones + "generar_consecutivo_cotizacion/" + tipo_cotizacion + "/" + idUsuario)
                .then(generarConsecutivoCotizacionComplete)
                .catch(generarConsecutivoCotizacionFailed);

            function generarConsecutivoCotizacionComplete(response) {
                return response.data;
            }

            function generarConsecutivoCotizacionFailed(error) {
                logger.error('XHR falló en generarConsecutivoCotizacion', error);
                return error;
            }
        }


        function insertNuevoProducto(request) {
            return $http.post(configService.ApiUrls.UrlGestionCotizaciones + "insert_nuevo_producto/", JSON.stringify(request))
                .then(insertNuevoProductocomplete)
                .catch(insertNuevoProductoFailed);

            function insertNuevoProductocomplete(response) {
                return response.data;
            }

            function insertNuevoProductoFailed(error) {
                console.log('Error en insertNuevoProducto', error);
                return error;
            }
        }


        function getProductosDesarrollados() {
            //$rootScope.progressbar.start();
            return $http.get(configService.ApiUrls.UrlGestionCotizaciones + "get_productos")
                .then(getProductosDesarrolladosComplete)
                .catch(getProductosDesarrolladosFailed);

            function getProductosDesarrolladosComplete(response) {
                //$rootScope.progressbar.complete();
                return response.data;
            }

            function getProductosDesarrolladosFailed(error) {
                //$rootScope.progressbar.reset();
                toastr.error('XHR falló en getProductosDesarrollados', error);
                return error;
            }
        }


        function getCotizacionesByUsusario(idUsuario) {
            //$rootScope.progressbar.start();
            return $http.get(configService.ApiUrls.UrlGestionCotizaciones + "get_cotizaciones_by_usuario/" + idUsuario)
                .then(getCotizacionesByUsusarioComplete)
                .catch(getCotizacionesByUsusarioFailed);

            function getCotizacionesByUsusarioComplete(response) {
                //$rootScope.progressbar.complete();
                return response.data;
            }

            function getCotizacionesByUsusarioFailed(error) {
                //$rootScope.progressbar.reset();
                toastr.error('XHR falló en getCotizacionesByUsusario', error);
                return error;
            }
        }


        function getDetalleCotizacion(csIdCotizacion) {
            //$rootScope.progressbar.start();
            return $http.get(configService.ApiUrls.UrlGestionCotizaciones + "get_detalle_cotizacion/" + csIdCotizacion)
                .then(getDetalleCotizacionComplete)
                .catch(getDetalleCotizacionFailed);

            function getDetalleCotizacionComplete(response) {
                //$rootScope.progressbar.complete();
                return response.data;
            }

            function getDetalleCotizacionFailed(error) {
                //$rootScope.progressbar.reset();
                toastr.error('XHR falló en getDetalleCotizacion', error);
                return error;
            }
        }







        //=========================================================================================================================================


        function getAllMaterialesProductosDesarrollados() {
            return $http.get(configService.ApiUrls.UrlGestionCotizaciones + "get_all_materiales_productos_desarrollados")
                .then(getAllMaterialesProductosDesarrolladosComplete)
                .catch(getAllMaterialesProductosDesarrolladosFailed);

            function getAllMaterialesProductosDesarrolladosComplete(response) {
                return response.data;
            }

            function getAllMaterialesProductosDesarrolladosFailed(error) {
                toastr.error('XHR falló en getAllMaterialesProductosDesarrollados', error);
                return error;
            }
        }

        function getProductosDesarrolladosForGestionImagen() {
            return $http.get(configService.ApiUrls.UrlGestionCotizaciones + "get_productos_desarrollados_for_gestion_imagen")
                .then(getProductosDesarrolladosForGestionImagenComplete)
                .catch(getProductosDesarrolladosForGestionImagenFailed);

            function getProductosDesarrolladosForGestionImagenComplete(response) {
                return response.data;
            }

            function getProductosDesarrolladosForGestionImagenFailed(error) {
                toastr.error('XHR falló en getProductosDesarrolladosForGestionImagen', error);
                return error;
            }
        }

        function editarProductoDtCotizacion(request) {
            return $http.post(configService.ApiUrls.UrlGestionCotizaciones + "editar_producto_dt_cotizacion", JSON.stringify(request))
                .then(editarProductoDtCotizacioncomplete)
                .catch(editarProductoDtCotizacionFailed);

            function editarProductoDtCotizacioncomplete(response) {
                return response.data;
            }

            function editarProductoDtCotizacionFailed(error) {
                console.log('Error en editarProductoDtCotizacion', error);
                return error;
            }
        }

        function getInsumosByProductoCotizacion(cs_id_dt_cotizacion) {
            return $http.get(configService.ApiUrls.UrlGestionCotizaciones + "get_insumos_by_producto_cotizacion/" + cs_id_dt_cotizacion)
                .then(getInsumosByProductoCotizacionComplete)
                .catch(getInsumosByProductoCotizacionFailed);

            function getInsumosByProductoCotizacionComplete(response) {
                return response.data;
            }

            function getInsumosByProductoCotizacionFailed(error) {
                toastr.error('XHR falló en getInsumosByProductoCotizacion', error);
                return error;
            }
        }

        function updateEstadoHCotizaciones(request) {
            return $http.post(configService.ApiUrls.UrlGestionCotizaciones + "update_estado_h_cotizaciones/", JSON.stringify(request))
                .then(updateEstadoHCotizacionescomplete)
                .catch(updateEstadoHCotizacionesFailed);

            function updateEstadoHCotizacionescomplete(response) {
                return response.data;
            }

            function updateEstadoHCotizacionesFailed(error) {
                console.log('Error en updateEstadoHCotizaciones', error);
                return error;
            }
        }

        function deleteProductoDtCotizacion(request) {
            return $http.post(configService.ApiUrls.UrlGestionCotizaciones + "delete_producto_dt_cotizacion/", JSON.stringify(request))
                .then(deleteProductoDtCotizacioncomplete)
                .catch(deleteProductoDtCotizacionFailed);

            function deleteProductoDtCotizacioncomplete(response) {
                return response.data;
            }

            function deleteProductoDtCotizacionFailed(error) {
                console.log('Error en deleteProductoDtCotizacion', error);
                return error;
            }
        }

        function insertProductosCotizacion(request) {
            return $http.post(configService.ApiUrls.UrlGestionCotizaciones + "insert_productos_cotizacion/", JSON.stringify(request))
                .then(insertProductosCotizacioncomplete)
                .catch(insertProductosCotizacionFailed);

            function insertProductosCotizacioncomplete(response) {
                return response.data;
            }

            function insertProductosCotizacionFailed(error) {
                console.log('Error en insertProductosCotizacion', error);
                return error;
            }
        }

        function getMaterialesProductosDesarrollados(idItemReferencia) {
            //$rootScope.progressbar.start();
            return $http.get(configService.ApiUrls.UrlGestionCotizaciones + "get_materiales_productos_desarrollados/" + idItemReferencia)
                .then(getMaterialesProductosDesarrolladosComplete)
                .catch(getMaterialesProductosDesarrolladosFailed);

            function getMaterialesProductosDesarrolladosComplete(response) {
                //$rootScope.progressbar.complete();
                return response.data;
            }

            function getMaterialesProductosDesarrolladosFailed(error) {
                //$rootScope.progressbar.reset();
                toastr.error('XHR falló en getMaterialesProductosDesarrollados', error);
                return error;
            }
        }


   

        function insertEncabezadoCotizacion(request) {
            return $http.post(configService.ApiUrls.UrlGestionCotizaciones + "insert_h_Cotizacion/", JSON.stringify(request))
                .then(insertEncabezadoCotizacioncomplete)
                .catch(insertEncabezadoCotizacionFailed);

            function insertEncabezadoCotizacioncomplete(response) {
                return response.data;
            }

            function insertEncabezadoCotizacionFailed(error) {
                console.log('Error en insertEncabezadoCotizacion', error);
                return error;
            }
        }



        function getOpsForGestionOperarioExtraLaboral(request) {
            $rootScope.progressbar.start();
            return $http.post(configService.ApiUrls.UrlGestionProduccion
                    + "get_ops_for_gestion_operario_extra_laboral", JSON.stringify(request))
                .then(getOpsForGestionOperarioExtraLaboralComplete)
                .catch(getOpsForGestionOperarioExtraLaboralError);

            function getOpsForGestionOperarioExtraLaboralComplete(response) {
                $rootScope.progressbar.complete();
                return response.data;
            }

            function getOpsForGestionOperarioExtraLaboralError(error) {
                $rootScope.progressbar.reset();
                toastr.error('Error en getOpsForGestionOperarioExtraLaboral', error);
                return error;
            }
        }



    

        function insertarArchivoCostosMdc(request) {

            return $http.post(configService.ApiUrls.UrlGestionCotizaciones + "insert_data_costos_mdc/", JSON.stringify(request))
                .then(insertarArchivoCostosMdcComplete)
                .catch(insertarArchivoCostosMdcFailed);

            function insertarArchivoCostosMdcComplete(response) {
                return response.data;
            }

            function insertarArchivoCostosMdcFailed(error) {
                console.log('Error en insertarArchivoCostosMdcFailed', error);
                return error;
            }
        }


        function getCostosProductosInsumosRtaMdc() {
            //$rootScope.progressbar.start();
            return $http.get(configService.ApiUrls.UrlGestionCotizaciones + "get_costos_productos_insumos_rta_mdc")
                .then(getCostosProductosInsumosRtaMdcComplete)
                .catch(getCostosProductosInsumosRtaMdcFailed);

            function getCostosProductosInsumosRtaMdcComplete(response) {
                //$rootScope.progressbar.complete();
                return response.data;
            }

            function getCostosProductosInsumosRtaMdcFailed(error) {
                //$rootScope.progressbar.reset();
                toastr.error('XHR falló en getCostosProductosInsumosRtaMdcF', error);
                return error;
            }
        }


        function getParametrosMulti(request) {
            $rootScope.progressbar.start();
            return $http.post(configService.ApiUrls.UrlGestionProduccion + "getparametrosmulti", JSON.stringify({ 'parametros': request }))
                        .then(getParametrosMultiCompleto)
                        .catch(getParametrosMultiError);

            function getParametrosMultiCompleto(response) {
                $rootScope.progressbar.complete();
                return response.data;
            }

            function getParametrosMultiError(error) {
                $rootScope.progressbar.reset();
                console.log('Error en getParametrosMulti', error);
                return error;
            }
        }


        function updateArchivoCostosMdc(request) {
            return $http.post(configService.ApiUrls.UrlGestionCotizaciones + "update_costo_mdc/", JSON.stringify(request))
                .then(updateArchivoCostosMdcComplete)
                .catch(updateArchivoCostosMdcFailed);

            function updateArchivoCostosMdcComplete(response) {
                return response.data;
            }

            function updateArchivoCostosMdcFailed(error) {
                console.log('Error en updateArchivoCostosMdc', error);
                return error;
            }
        }

        function getHistoricoCostosMdc() {
            //$rootScope.progressbar.start();
            return $http.get(configService.ApiUrls.UrlGestionCotizaciones + "get_historico_costos_mdc")
                .then(getHistoricoCostosMdcComplete)
                .catch(getHistoricoCostosMdcFailed);

            function getHistoricoCostosMdcComplete(response) {
                //$rootScope.progressbar.complete();
                return response.data;
            }

            function getHistoricoCostosMdcFailed(error) {
                //$rootScope.progressbar.reset();
                toastr.error('XHR falló en getHistoricoCostosMdc', error);
                return error;
            }
        }


        function anularCostoMdc(request) {
            return $http.post(configService.ApiUrls.UrlGestionCotizaciones + "anular_costos_mdc/", JSON.stringify(request))
                .then(anularCostoMdcComplete)
                .catch(anularCostoMdcFailed);

            function anularCostoMdcComplete(response) {
                return response.data;
            }

            function anularCostoMdcFailed(error) {
                console.log('Error en anularCostoMdc', error);
                return error;
            }
        }


        function getDetallearchivoCostos(cs_id_costos) {
            return $http.get(configService.ApiUrls.UrlGestionCotizaciones + "get_detalle_archivo_costos_mdc/" + cs_id_costos)
                .then(getDetallearchivoCostosComplete)
                .catch(getDetallearchivoCostosFailed);

            function getDetallearchivoCostosComplete(response) {
                return response.data;
            }

            function getDetallearchivoCostosFailed(error) {
                toastr.error('XHR falló en getDetallearchivoCostos', error);
                return error;
            }
        }



        function insertEspesores(request) {
            return $http.post(configService.ApiUrls.UrlGestionCotizaciones + "insertEspesores/", JSON.stringify(request))
                .then(insertEspesoresComplete)
                .catch(insertEspesoresFailed);

            function insertEspesoresComplete(response) {
                return response.data;
            }

            function insertEspesoresFailed(error) {
                console.log('Error en insertEspesores', error);
                return error;
            }
        }


        function insertManoObra(request) {
            return $http.post(configService.ApiUrls.UrlGestionCotizaciones + "insertManoObra/", JSON.stringify(request))
                .then(insertManoObraComplete)
                .catch(insertManoObraFailed);

            function insertManoObraComplete(response) {
                return response.data;
            }

            function insertManoObraFailed(error) {
                console.log('Error en insertManoObra', error);
                return error;
            }
        }


    }
})();
