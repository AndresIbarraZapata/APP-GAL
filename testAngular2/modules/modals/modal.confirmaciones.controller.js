(function () {
    angular.module('appRTA')
        .controller('modalFrmConfirmacion',
        function ($scope, $uibModalInstance) {
        'use strict';

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        angular.activarBloqueoTAB(true);
    });
})();
