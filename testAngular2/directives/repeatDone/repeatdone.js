'use strict';

/**
 * @ngdoc directive
 * @name giapmobileAppApp.directive:repeatDone
 * @description
 * # repeatDone
 */
angular.module('appRTA')
    .directive('repeatDone', function() {
        return  function(scope, element, attrs) {
            if (scope.$last) { // all are rendered
                scope.$eval(attrs.repeatDone);
            }
        };
    });