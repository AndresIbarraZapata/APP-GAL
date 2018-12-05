/**
 * @author: desarrollo web
 */
(function() {
    "use strict";

    angular.module("appRTA",
        [
            "ui.router",
            "ngCookies",
            "ui.bootstrap",
            "ngProgress",
            "ngAnimate",
            "smart-table",
            "ui.sortable",
            "ngClickSelect",
            'ui.utils.masks',
            'angularFileUpload'
        ])
        .config(config)
        .controller("app", app)
        .run(function ($timeout, $location, $rootScope, loginService, configService, RTAService, $constants) {

            $rootScope.location = $location;

            var locationSearch = {};
            locationSearch = $location.search();

            angular.activarFancybox = function() {
                $timeout(function() {
                    $("img[alt^='zoom']").each(function() {
                        $(this).fancybox({
                            content: $("<img/>").attr("src", this.src).addClass("img-responsive"),
                            openEffect: "fade",
                            closeEffect: "fade",
                            openSpeed: 10,
                            playSpeed: 10,
                            autoScale: false,
                            autoDimensions: false,
                            'width': 350,
                            'height': "auto",
                            'transitionIn': "none",
                            'transitionOut': "none"
                        });
                    });
                }, 300);
            };

            angular.activarBloqueoTAB = function(switche) {
                if (switche) {
                    $(document).unbind("keydown").bind("keydown", function(event) {
                        var doPrevent = false;
                        if (event.keyCode === 9) {
                            var d = event.srcElement || event.target;
                            if ((d.tagName.toUpperCase() === "INPUT" &&
                                    (
                                        d.type.toUpperCase() === "TEXT" ||
                                            d.type.toUpperCase() === "PASSWORD" ||
                                            d.type.toUpperCase() === "FILE" ||
                                            d.type.toUpperCase() === "EMAIL" ||
                                            d.type.toUpperCase() === "SEARCH" ||
                                            d.type.toUpperCase() === "DATE")
                                ) ||
                                d.tagName.toUpperCase() === "TEXTAREA") {
                                doPrevent = d.readOnly || d.disabled;
                            } else {
                                doPrevent = true;
                            }
                        }

                        if (doPrevent) {
                            event.preventDefault();
                        }
                    });
                } else {
                    $(document).unbind("keydown");
                }
            };

            angular.verficar_perfil_usuario = function(opcion) {

                return true;

                if (!loginService.hasSession)
                    return false;

                if (_.isNull(loginService.UserData.c_perfil) || _.isUndefined(loginService.UserData.c_perfil)) {
                    toastr.warning("El usuario no tiene perfil, consulte con su administrador de sistema");
                    console.warn("El usuario no tiene perfil, consulte con su administrador de sistema");

                    $timeout(function() {
                        loginService.cerrarSesion();
                    }, 6000);

                    return false;
                }

                if (loginService.UserData.c_perfil === $constants.id_perfil_super_admin) {
                    return true;
                }

              
                //switch (opcion) {
                //    case "cotProductoDesarrollado":
                //        if (loginService.UserData.c_perfil === $constants.id_perfil_admin_pv) return true;
                //        break;
                //}

                return false;
            };

            //detectamos la version de la aplicación, si los parametros no coinciden, se refresca la página
            //además verificamos si la fecha de la version coinciden, si no son iguales mostramos un mensaje informando que se refrescara la página
            angular.VerificarVersionApp = function () {
                $("#back-alerts-version").hide();
                $("#alert-old-version-app").hide();
                $("#alert-refresh-required").hide();
                return
                RTAService.getVersionAppFromServer($constants.id_aplicacion)
                    .then(function(datos) {
                        if (!_.isNull(datos.version)) {

                            console.info("datos getVersionAppFromServer", datos);

                            if (datos.version !== VERSION_APP || datos.date_version !== DATE_VERSION) {

                                $("#back-alerts-version").show();

                                if (datos.version !== VERSION_APP) {
                                    //mostramos una alerta informando que existe una nueva version y que se refrescara la pagina
                                    $("#alert-old-version-app").show();
                                } else {
                                    //si las fechas de version de la app son diferentes mostramos una alerta informando que es requerido que se refresque la página
                                    $("#alert-refresh-required").show();
                                }
                                
                                $timeout(function() {
                                    window.location.reload();
                                }, 5100);
                            } else {
                                $("#back-alerts-version").hide();
                                $("#alert-old-version-app").hide();
                                $("#alert-refresh-required").hide();
                            }

                        } else {
                            toastr.error("Error al tratar de obtener la version actual de la aplicación. Comuniquese con el admin.");
                            console.error("Revisar config de webapinode_pos/produccion/gestion_produccion");
                        }
                    });
            };

            $rootScope.showMenuByErrorHttp = true;

            if (loginService.isSession()) {
                loginService.leerCookie();
                $rootScope.mostrarMenu = true;
                $location.path('/Home');

            } else {
                $rootScope.mostrarMenu = false;
                loginService.hasSession = false;
                $location.path('/login');
            }

            //$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            //    if (toState.name === 'login') {
            //        return;
            //    }

            //    //aquí implementamos la verificaciones de login
            //    if (loginService.isSession()) {
            //        $state.go('home');
            //        return loginService.guardarCookie(loginService.UserData);
            //    } else {
            //        event.preventDefault();
            //        $rootScope.mostrarMenu = false;
            //        loginService.hasSession = false;
            //        $state.go('login');
            //        console.warn("$state.go('login');")
            //    }
            //});

            //$rootScope.$on('$stateChangeSuccess',
            //    function(event, toState, toParams, fromState, fromParams) {
            //        //restore search term to url
            //        $location.search(locationSearch);
            //    }
            //);
            //detectamos la version de la aplicación, si los parametros no coinciden, se refresca la página
            //angular.VerificarVersionApp = function () {

            //    BDRequerimientosService.getCurrentVersionApp()
            //          .then(function (datos) {
            //              if (!_.isNull(datos.Msg)) {

            //                  if (datos.Msg !== VERSION_APP) {
            //                      //mostramos una alerta informando que existe una nueva version y que se refrescara la pagina
            //                      $("#alert-old-version-app").show();

            //                      $timeout(function () {
            //                          window.location.reload();
            //                      }, 5100);
            //                  } else
            //                      $("#alert-old-version-app").hide();

            //              } else {
            //                  toastr.error("Error al tratar de obtener la version actual de la aplicación. Comuniquese con el admin");
            //                  console.error("Revisar config de la api WebApiTickets");
            //              }
            //          });
            //};
        });

    function config($stateProvider, $urlRouterProvider) {
        moment.locale("es");
        var rand = parseInt(Math.random() * 10000);

        $stateProvider
            .state("inicio", {
                url: '/',
                templateUrl: "Index.html?v=" + VERSION_APP,
                controller: 'app',
                views: {
                    'scriptmodales': {
                        templateUrl: "modules/modals/scriptModal.html?rand=" + rand
                    }
                },
                controllerAs: 'app'
            })
            .state("login", {
                url: '/login',
                views: {
                    '': {
                        templateUrl: "modules/UserLogin/UserLogin.html?rand=" + rand,
                        controller: "UserLogin"
                    }
                }
            })
            .state("home", {
                url: "/Home",
                views: {
                    '': {
                        templateUrl: "modules/Home/Home.html?rand=" + rand,
                        controller: "Home"
                    },
                    'templateModal@home': {
                        templateUrl: "modules/modals/scriptModal.html?rand=" + rand
                    }
                }
            })
            .state("cotProductoDesarrollado", {
                url: "/cotProductoDesarrollado",
                views: {
                    '': {
                        templateUrl: "modules/cotProductoDesarrollado/cotProductoDesarrollado.html?rand=" + rand,
                        controller: "cotProductoDesarrollado"
                    },
                    'templateModal@cotProductoDesarrollado': {
                        templateUrl: "modules/modals/scriptModal.html?rand=" + rand
                    }
                }
            })
            .state("cotProductoModificado", {
                url: "/cotProductoModificado",
                views: {
                    '': {
                        templateUrl: "modules/cotProductoModificado/cotProductoModificado.html?rand=" + rand,
                        controller: "cotProductoModificado"
                    },
                    'templateModal@cotProductoModificado': {
                        templateUrl: "modules/modals/scriptModal.html?rand=" + rand
                    }
                }
            })
            //.state("cotProductoNuevo", {
            //    url: "/cotProductoNuevo",
            //    views: {
            //        '': {
            //            templateUrl: "modules/cotProductoNuevo/cotProductoNuevo.html?rand=" + rand,
            //            controller: "cotProductoNuevo"
            //        },
            //        'templateModal@cotProductoNuevo': {
            //            templateUrl: "modules/modals/scriptModal.html?rand=" + rand
            //        }
            //    }
            //})
            .state("cotRegNuevoProducto", {
                url: "/cotRegNuevoProducto",
                views: {
                    '': {
                        templateUrl: "modules/cotRegNuevoProducto/cotRegNuevoProducto.html?rand=" + rand,
                        controller: "cotRegNuevoProducto"
                    },
                    'templateModal@cotRegNuevoProducto': {
                        templateUrl: "modules/modals/scriptModal.html?rand=" + rand
                    }
                }
            })
            .state("uploadImagenProducto", {
                url: "/uploadImagenProducto",
                views: {
                    '': {
                        templateUrl: "modules/uploadImagenProducto/uploadImagenProducto.html?rand=" + rand,
                        controller: "uploadImagenProducto"
                    },
                    'templateModal@uploadImagenProducto': {
                        templateUrl: "modules/modals/scriptModal.html?rand=" + rand
                    }
                }
            })
            .state("adminUploadArchivos", {
                url: "/adminUploadArchivos",
                views: {
                    '': {
                        templateUrl: "modules/adminUploadArchivos/adminUploadArchivos.html?rand=" + rand,
                        controller: "adminUploadArchivos"
                    },
                    'templateModal@adminUploadArchivos': {
                        templateUrl: "modules/modals/scriptModal.html?rand=" + rand
                    }
                }
            })
            .state("gestionManoObraCif", {
                url: "/gestionManoObraCif",
                views: {
                    '': {
                        templateUrl: "modules/gestionManoObraCif/gestionManoObraCif.html?rand=" + rand,
                        controller: "gestionManoObraCif"
                    },
                    'templateModal@adminUploadArchivos': {
                        templateUrl: "modules/modals/scriptModal.html?rand=" + rand
                    }
                }
            })
            .state("gestionEspesores", {
                url: "/gestionEspesores",
                views: {
                    '': {
                        templateUrl: "modules/gestionEspesores/gestionEspesores.html?rand=" + rand,
                        controller: "gestionEspesores"
                    },
                    'templateModal@adminUploadArchivos': {
                        templateUrl: "modules/modals/scriptModal.html?rand=" + rand
                    }
                }
            });

        $urlRouterProvider.otherwise("/");


    }

    function app($scope, $rootScope, $location, loginService, ngProgressFactory, configService, parametrosService, $uibModal, $timeout) {

        var vm = $scope;

        vm.Init = function() {
            
            vm.verificarPerfil          = verificarPerfil;
            vm.cerrarSession            = cerrarSession;
            vm.get_pv_actual            = get_pv_actual;
            vm.seleccionar_sede         = seleccionar_sede;
            vm.showFiltros              = showFiltros;
            vm.seleccionar_tipo_barcode = seleccionar_tipo_barcode;
            vm.is_sucursal_selected     = is_sucursal_selected;
            vm.reload_app               = reload_app;

            //#region Configuraciones
            vm.VERSION_APP = VERSION_APP;
            vm.DATE_VERSION = DATE_VERSION;

            console.info("VERSION_APP", vm.VERSION_APP);
            $rootScope.objectDialog = vm.objectDialog = {};

            /*instancia global progressbar*/
            $rootScope.progressbar = ngProgressFactory.createInstance();
            
            /*obtenemos los parametros almacenados en la BD*/
            //parametrosService.updateConfiguracionMparametros();

            var slideToTop = $("<div  class='btn-mdc' />");
            slideToTop.html("<i class=\"fa fa-arrow-circle-up fa-2x\" style=\"line-height: 1.3;text-shadow: 0 1px 0 rgba(0, 0, 0, 0.55);\"></i>");
            slideToTop.css({
                position: "fixed",
                bottom: "15px",
                right: "5px",
                width: "40px",
                height: "40px",
                color: "white",
                'line-height': "40px",
                'text-align': "center",
                'background-color': "#cffe00",
                cursor: "pointer",
                'border-radius': "8px",
                'z-index': "1049",
                opacity: ".9",
                'display': "none",
                'box-shadow': "1px 1px 11px -2px black"
            });

            slideToTop.on("mouseenter", function() {
                $(this).css("opacity", "1");
            });
            slideToTop.on("mouseout", function() {
                $(this).css("opacity", ".9");
            });
            $("body").append(slideToTop);
            $(window).scroll(function() {
                if ($(window).scrollTop() >= 150) {
                    if (!$(slideToTop).is(":visible")) {
                        $(slideToTop).removeClass("animated fadeOutRight");
                        $(slideToTop).fadeIn(500);
                        $(slideToTop).addClass("animated fadeInRight");
                    }
                } else {
                    $(slideToTop).removeClass("animated fadeInRight");
                    $(slideToTop).addClass("animated fadeOutRight");
                    $(slideToTop).fadeOut(500);
                }
            });
            $(slideToTop).click(function() {
                $("html").animate({
                    scrollTop: 0
                }, 200);
            });

            alertify.defaults = {
                // dialogs defaults
                modal: true,
                basic: false,
                frameless: false,
                movable: false,
                resizable: false,
                closable: false,
                closableByDimmer: true,
                maximizable: false,
                startMaximized: false,
                pinnable: true,
                pinned: true,
                padding: true,
                overflow: true,
                maintainFocus: false,
                //transition    : 'slide',
                autoReset: true,

                // notifier defaults
                notifier: {
                    // auto-dismiss wait time (in seconds)  
                    delay: 5,
                    // default position
                    position: "bottom-right"
                },

                // language resources 
                glossary: {
                    // dialogs default title
                    title: "Notificacion",
                    // ok button text
                    ok: "Aceptar",
                    // cancel button text
                    cancel: "Cancelar"
                },

                // theme settings
                theme: {
                    // class name attached to prompt dialog input textbox.
                    input: "ajs-input",
                    // class name attached to ok button
                    ok: "btn btn-mdc",
                    // class name attached to cancel button 
                    cancel: "btn btn-mdc"
                }
            };

            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": true,
                "progressBar": false,
                "positionClass": "toast-top-center",
                "preventDuplicates": true,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "8000",
                "timeOut": "8000",/*configuración para extender el tiempo en que se muestra la alerta*/
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }

            $rootScope.actualPage = "";
            vm.loginService = loginService;

            vm.valido = false;
            vm.mostrarMenu = true;
            var screenSizes = {
                xs: 480,
                sm: 768,
                md: 992,
                lg: 1200
            }
            //#endregion

            //#region Metodos
            function reload_app() {
                window.location.reload();
            };

            function verificarPerfil(opcion) {
                return angular.verficar_perfil_usuario(opcion);
            };

            function cerrarSession() {
                loginService.cerrarSesion();
            };

            function get_pv_actual() {
                return loginService.UserData.c_centro_operacion_selected;
            };

            function is_sucursal_selected() {

                if (!_.isUndefined(loginService.UserData.c_centro_operacion_selected) && !_.isNull(loginService.UserData.c_centro_operacion_selected))
                    return true;
                else
                    return false;
            }

            function seleccionar_sede() {
                loginService.UserData.c_centro_operacion_selected = null;
                $location.path('/Home');
            };

            function showFiltros() {
                //Enable sidebar push menu
                if ($(window).width() > (screenSizes.sm - 1)) {
                    if ($("body").hasClass("sidebar-collapse")) {
                        $("body").removeClass("sidebar-collapse").trigger("expanded.pushMenu");

                    } else {
                        $("body").addClass("sidebar-collapse").trigger("collapsed.pushMenu");
                    }
                }
                //Handle sidebar push menu for small screens
                else {
                    if ($("body").hasClass("sidebar-open")) {
                        $("body").removeClass("sidebar-open").removeClass("sidebar-collapse").trigger("collapsed.pushMenu");
                    } else {
                        $("body").addClass("sidebar-open").trigger("expanded.pushMenu");
                    }
                }
            };

            function seleccionar_tipo_barcode() {
                $uibModal.open({
                    templateUrl: "frmTipoBarcode.html",
                    backdrop: "static",
                    keyboard: false,
                    controller: "modalFrmTipoBarcode"
                });
            }
            //#endregion

        };
        vm.Init();
    }
}());