/// <reference path="../angular.d.ts" />
/// <reference path="../angular-material.d.ts" />
/// <reference path="../appts.ts" />

/*
Controller for the outer layer of the page.
*/
interface IMainScope extends ng.IScope
{
	NavLinks: any[];
	CurrentPage: { Title:string, ActiveURL:string };
	toggleSidenav: (menuId: string) => void;
}

angular.module("IRControlApp").controller("MainController", ["$scope", "$location", "$route", "$mdSidenav", "NavLinks",
function($scope : IMainScope, $location: ng.ILocationService, $route: IAppRoutes, $mdSidenav: angular.material.MDSidenavService,
	navLinks : PageDefinition[])
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