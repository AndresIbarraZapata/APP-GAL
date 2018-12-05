angular.module('appRTA')
    .directive('pageSelect', function ($rootScope) {
        return {
            restrict: 'E',
            template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
            link: function (scope, element, attrs) {
                scope.$watch('currentPage', function (c) {
                    scope.inputPage = c;
                    
                    $("html").animate({
                        scrollTop: 0
                    }, 200);
                });
            }
        }
    });

