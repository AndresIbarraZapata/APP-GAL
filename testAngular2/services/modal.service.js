/**
 * @author: desarrollo web
 */
(function() {
    "use strict";

    angular
        .module('appRTA')
        .factory('modalService', modalService);

    modalService.$inject = ['RTAService', 'parametrosService', '$uibModal'];

    /* @ngInject */
    function modalService(RTAService, parametrosService, $uibModal) {
        return {
            modalFormConfirmacion: modalFormConfirmacion,
            modalFormAddNuevoProyecto: modalFormAddNuevoProyecto,
            modalFormBuscarCotizaciones: modalFormBuscarCotizaciones,
            modalFormDetalleItemCot: modalFormDetalleItemCot,
            modalFormEditarItemCot: modalFormEditarItemCot,
            modalFormBuscarCostosMdc: modalFormBuscarCostosMdc,
            modalFormBusquedaProyectos: modalFormBusquedaProyectos,
            modalFormDetalleProducto: modalFormDetalleProducto,
            modalFormDetalleProductoModificacionInsumos: modalFormDetalleProductoModificacionInsumos,
            modalFormBusquedaInsumosProducto: modalFormBusquedaInsumosProducto
        };

        function modalFormBusquedaInsumosProducto(insumosProducto) {
            var modalInstance = $uibModal.open({
                templateUrl: "frmBusquedaInsumosProducto.html",
                backdrop: "static",
                keyboard: false,
                controller: "modalBusquedaInsumosProducto",
                size: "detalle-producto-cotizacion",
                resolve: {
                    insumosProducto: function () {
                        return insumosProducto;
                    }
                }
            });

            return modalInstance.result;
        }

        function modalFormDetalleProductoModificacionInsumos(producto) {
            var modalInstance = $uibModal.open({
                templateUrl: "frmDetalleProductoModificacionInsumos.html",
                backdrop: "static",
                keyboard: false,
                controller: "detalleProductoModificacionInsumos",
                size: "detalle-producto-cotizacion",
                resolve: {
                    producto: function () {
                        return producto;
                    }
                }
            });

            return modalInstance.result;
        }

        function modalFormDetalleProducto(producto) {
            var modalInstance = $uibModal.open({
                templateUrl: "frmDetalleProducto.html",
                backdrop: "static",
                keyboard: false,
                controller: "detalleProducto",
                size: "detalle-producto-cotizacion",
                resolve: {
                    producto: function () {
                        return producto;
                    }
                }
            });

            return modalInstance.result;
        }

        function modalFormBusquedaProyectos(list_productos_seleccionados) {
            var modalInstance = $uibModal.open({
                templateUrl: "frmBusquedaProyectos.html",
                backdrop: "static",
                keyboard: false,
                controller: "modalFrmbusquedaProyectos",
                size: "seleccion-producto",
                resolve: {
                    listProductosSeleccionados: function () {
                        return list_productos_seleccionados;
                    }
                }
            });

            return modalInstance.result;
        }

        function modalFormEditarItemCot(itemCot) {
            var modalInstance = $uibModal.open({
                templateUrl: "frmEditarItemCot.html",
                backdrop: "static",
                keyboard: false,
                controller: "editarItemCot",
                size: "detalle-producto-cotizacion",
                resolve: {
                    itemCot: function () {
                        return itemCot;
                    }
                }
            });

            return modalInstance.result;
        }

        function modalFormDetalleItemCot(itemCot) {
            var modalInstance = $uibModal.open({
                templateUrl: "frmDetalleItemCot.html",
                backdrop: "static",
                keyboard: false,
                controller: "detalleItemCot",
                size: "detalle-producto-cotizacion",
                resolve: {
                    itemCot: function () {
                        return itemCot;
                    }
                }
            });

            return modalInstance.result;
        }

        function modalFormBuscarCotizaciones() {
            var modalInstance = $uibModal.open({
                templateUrl: "frmBusquedaCotizaciones.html",
                backdrop: "static",
                keyboard: false,
                controller: "busquedaCotizaciones",
                size: "lg",
            });

            return modalInstance.result;
        }

        function modalFormConfirmacion(message) {
            var modalHtml = '<div class="modal-body" style="font-size: 17px;">' + message + '</div>';
            modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">SI</button><button class="btn btn-warning" ng-click="cancel()">No</button></div>';

            var modalInstance = $uibModal.open({
                template: modalHtml,
                controller: "modalFrmConfirmacion",
                //windowClass: 'center-modal', // http://stackoverflow.com/questions/23170392/center-angular-modal-ui
                backdrop: false
            });

            return modalInstance.result;
        }
        
        function modalFormAddNuevoProyecto(list_productos_seleccionados) {
            var modalInstance = $uibModal.open({
                templateUrl: "frmAddNuevoProyecto.html",
                backdrop: "static",
                keyboard: false,
                controller: "modalFrmAddNuevoProyecto",
                size: "seleccion-producto",
                resolve: {
                    listProductosSeleccionados: function () {
                        return list_productos_seleccionados;
                    }
                }
            });

            return modalInstance.result;
        }



        function modalFormBuscarCostosMdc() {
            var modalInstance = $uibModal.open({
                templateUrl: "frmBusquedaArchivosMdc.html",
                backdrop: "static",
                keyboard: false,
                controller: "busquedaCostosMdc",
                size: "lg"
            });

            return modalInstance.result;
        }


    }
})();
