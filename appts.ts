/// <reference path="angular.d.ts" />
/// <reference path="angular-route.d.ts" />
/// <reference path="angular-material.d.ts" />

var app = angular.module("IRControlApp", ["ng", "ngMaterial", "ngRoute"]);

class PageDefinition
{
	Title: string;
	URL: string;
	Template: string;
	Controller: string;
}

var navLinks : PageDefinition[] =
[
	{ Title: "Control", URL: "control", Template: "control.html", Controller: "ControllerController" },
	{ Title: "Schedule", URL: "schedule", Template: "schedule.html", Controller: "ScheduleController" }
];

app.config(["$routeProvider", function($routeProvider: ng.route.IRouteProvider)
{
	angular.forEach(navLinks, function(link : PageDefinition)
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
interface IMainScope extends ng.IScope
{
	NavLinks: any[];
	CurrentPage: { Title:string, ActiveURL:string };
	toggleSidenav: (menuId: string) => void;
}

interface IAppCurrentRoute extends ng.route.ICurrentRoute
{
    locals:
	{
        $scope: ng.IScope;
        $template: string;
		PageDefinition: PageDefinition
    };
}

interface IAppRoutes extends ng.route.IRouteService
{
	current: IAppCurrentRoute;
}

app.controller("MainController", ["$scope", "$location", "$route", "$mdSidenav",
function($scope : IMainScope, $location: ng.ILocationService, $route: IAppRoutes, $mdSidenav: angular.material.MDSidenavService)
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
