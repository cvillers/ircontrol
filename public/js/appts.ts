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

app.constant("NavLinks", navLinks);

app.config(["$routeProvider", function($routeProvider: ng.route.IRouteProvider)
{
	angular.forEach(navLinks, function(link : PageDefinition)
	{
		$routeProvider.when("/" + link.URL,
			{
				templateUrl: "templates/" + link.Template,
				controller: link.Controller,
				resolve: { PageDefinition: function() { return link } }
			});
	});

	$routeProvider.otherwise("/control");
}]);



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
