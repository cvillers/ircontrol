/// <reference path="../angular.d.ts" />
/// <reference path="../services/buttons.ts" />

/*
Controller for the main button-pusher.
*/

interface IControllerScope extends ng.IScope
{
	State: {
		Power: boolean,
		Mode: FanMode
	},
	Buttons: { [ id: string ]: Button }
}

angular.module("IRControlApp").controller("ControllerController", ["$scope", "buttonService",
function($scope: IControllerScope, buttonService: IButtonService)
{
	var buttonRecords = buttonService.GetButtons();

	console.dir(buttonRecords);

	$scope.Buttons = {};

	angular.forEach(buttonRecords, (br : Button) =>
	{
		$scope.Buttons[br.Id] = br;
	});
	
	$scope.State = { Power: buttonService.GetPowerState(), Mode: buttonService.GetFanMode() };
	
	
}]);