var app = angular.module("IRControlApp", ["ng", "ngMaterial", "ngRoute"]);

var navLinks =
[
	{ Title: "Control", URL: "control", Template: "control.html", Controller: "ControllerController" },
	{ Title: "Schedule", URL: "schedule", Template: "schedule.html", Controller: "ScheduleController" }
];

app.config(["$routeProvider", function($routeProvider)
{
	angular.forEach(navLinks, function(link)
	{
		$routeProvider.when("/" + link.URL,
			{
				templateUrl: "templates/" + link.Template,
				resolve: { PageDefinition: function() { return link } }
			});
	});

	$routeProvider.otherwise("/control");
}]);

/*
Controller for the outer layer of the page.
*/
app.controller("MainController", ["$scope", "$location", "$route", "$mdSidenav",
function($scope, $location, $route, $mdSidenav)
{
	$scope.NavLinks = navLinks;

	$scope.$on("$routeChangeSuccess", function()
	{
		$scope.CurrentPage =
		{
			Title: $route.current.locals.PageDefinition.Title,
			ActiveURL: $location.path().replace(/^\//, "")
		};
	})

	$scope.CurrentPage =
	{
		Title: "blah",//$route.current.CurrentPage.Title,
		ActiveURL: $location.path().replace(/^\//, "")
	};

	$scope.toggleSidenav = function(menuId)
	{
		$mdSidenav(menuId).toggle();
	};
}]);

/*
Controller for the main button-pusher.
*/
app.controller("ControllerController", ["$scope",
function($scope)
{

}]);

/*
Controller for the schedule configuration.
*/
app.controller("ScheduleController", ["$scope",
function($scope)
{

}]);
