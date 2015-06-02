var app = angular.module('IRControlApp', ['ngMaterial', "ngRoute"]);

var navLinks = [
	{ Text: "Control", URL: "control" },
	{ Text: "Schedule", URL: "schedule" }
];

app.config(["$routeProvider", function($routeProvider)
{
	$routeProvider.when("/control", { template: "Control buttons!" });
	$routeProvider.when("/schedule", { template: "Scheduler!" });
	$routeProvider.otherwise({ template: "Main!" });
}]);

app.controller('MainController', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
	$scope.PageTitle = "Main";

	$scope.NavLinks = navLinks;

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
 
}]);

