(function() {
    'use strict';
    angular.module('appRTA')
        .filter('toMomentDate', function($filter) {
            return function(input) {
                if (input === null || _.isUndefined(input)) {
                    return "";
                }
                return moment(input).format("DD/MMMM/YYYY");
            };
        })
        .filter('toMomentDateTime', function($filter) {
            return function(input) {
                if (input === null || _.isUndefined(input)) {
                    return "";
                }
                return moment(input).format("DD/MMMM/YYYY HH:mm");
            };
        })
        .filter('toFromNow', function($filter) {
            return function(input) {
                if (input === null || _.isUndefined(input)) {
                    return "";
                }
                return moment(input).fromNow();
            };
        })
        .filter('toMomentDateTimeNum', function($filter) {
            return function(input) {
                if (input === null || _.isUndefined(input) || input === "") {
                    return "";
                }
                return moment(input).format("DD/MM/YYYY HH:mm:ss");
            };
        })
        .filter('toMomentDateWithoutYear', function($filter) {
            return function(input) {
                if (input === null || _.isUndefined(input) || input === "") {
                    return "";
                }
                return moment(input).format("DD/MMM HH:mm");
            };
        })
        .filter('toDateWithoutYear', function ($filter) {
            return function (input) {
                if (input === null || _.isUndefined(input) || input === "") {
                    return "";
                }
                return moment(input).format("DD/MMMM");
            };
        });
})();

