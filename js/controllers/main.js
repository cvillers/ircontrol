/// <reference path="../angular.d.ts" />
/// <reference path="../angular-material.d.ts" />
/// <reference path="../appts.ts" />
angular.module("IRControlApp").controller("MainController", ["$scope", "$location", "$route", "$mdSidenav", "NavLinks",
    function ($scope, $location, $route, $mdSidenav, navLinks) {
        $scope.NavLinks = navLinks;
        $scope.$on("$routeChangeSuccess", function () {
            $scope.CurrentPage =
                {
                    Title: $route.current.locals.PageDefinition.Title,
                    ActiveURL: $location.path().replace(/^\//, "")
                };
        });
        $scope.CurrentPage =
            {
                Title: "blah",
                ActiveURL: $location.path().replace(/^\//, "")
            };
        $scope.toggleSidenav = function (menuId) {
            $mdSidenav(menuId).toggle();
        };
    }]);
//# sourceMappingURL=main.js.map