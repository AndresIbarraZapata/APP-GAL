(function () {
    "use strict";

    angular.module('appRTA')
           .factory('configService', function ($location) {

            var protocolo = $location.protocol();
            var host      = $location.host();
            var puerto    = $location.port();

            var urlbase = protocolo + "://" + host + ":" + puerto;
            
            var pathApiNode = "";

            if (host === "localhost") {
                
                //NODE URL LOCAL
                pathApiNode = "http://localhost:1600";

                urlbase = 'http://192.168.1.20';
            } else {
                
                pathApiNode = urlbase + "/WebApiRta";
            }
               
            var configService = {
                ApiUrls: {
                    
                    UrlGestionCotizaciones: pathApiNode + "/cotizaciones/gestion_cotizaciones/",
                    
                },
                variables: {
                    Dominio: urlbase
                }
            };
            return configService;
        });
}());


