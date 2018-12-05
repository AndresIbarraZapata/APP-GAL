var constants = {
    id_aplicacion                   : 22,
    id_perfil_admin_produccion      : 11,
    id_perfil_bodeguero             : 12,
    id_perfil_operario              : 13,
    id_perfil_admin_pv              : 14,
    id_perfil_super_admin           : 21,
    dias_consulta_panel_control     : 8,
    diff_server_datetime            : 10,
    prefijo_barcode_entrega_producto: "EC"
};

angular.module('appRTA')
       .constant("$constants", constants);