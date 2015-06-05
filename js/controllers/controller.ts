/// <reference path="../angular.d.ts" />
/// <reference path="../services/buttons.ts" />

/*
Controller for the main button-pusher.
*/

interface IControllerScope extends ng.IScope
{
	ControlState: {
		Power: boolean,
		Mode: FanMode
	};
	Buttons: { [ id: string ]: Button };
	
	PushButton : (name: string) => void;
}

angular.module("IRControlApp").controller("ControllerController", ["$scope", "IRButtons",
function($scope: IControllerScope, buttonService: IButtonService)
{
	var buttonRecords = buttonService.GetButtons();

	$scope.Buttons = {};

	angular.forEach(buttonRecords, (br : Button) =>
	{
		$scope.Buttons[br.Id] = br;
	});

	$scope.ControlState = { Power: buttonService.GetPowerState(), Mode: buttonService.GetFanMode() };
	
	$scope.$watch(s => (<IControllerScope>s).ControlState.Power, (n, o, s) => buttonService.SetPowerState(n));
	
	$scope.$watch(s => (<IControllerScope>s).ControlState.Mode, (n, o, s) => buttonService.SetFanMode(n));
	
	$scope.PushButton = (name: string) =>
	{
		buttonService.PushButton($scope.Buttons[name])
	};
}]);