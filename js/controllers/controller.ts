/// <reference path="../angular.d.ts" />

/*
Controller for the main button-pusher.
*/
enum ControllerMode
{
	Unknown,
	Cool,
	EnergySaver,
	Fan
}

interface IControllerScope extends ng.IScope
{
	State: {
		Power: boolean,
		Mode: ControllerMode
	}
}

angular.module("IRControlApp").controller("ControllerController", ["$scope",
function($scope: IControllerScope)
{
	$scope.State = { Power: false, Mode: ControllerMode.Cool };
}]);