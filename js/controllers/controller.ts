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

class ControllerController
{
	private _scope: IControllerScope;
	private _buttonService: IButtonService;
	
	private _buttons: Button[];
	private _buttonMap: { [ id: string ]: Button };

	public constructor(scope: IControllerScope, buttonService: IButtonService)
	{
		var self = this;

		this._scope = scope;
		this._buttonService = buttonService;
		
		this._buttons = buttonService.GetButtons();
		this._buttonMap = {};

		angular.forEach(this._buttons, (br : Button) =>
		{
			this._buttonMap[br.Id] = br;
		});
		
		this._scope.Buttons = this._buttonMap;
		
		this._scope.ControlState = { Power: buttonService.GetPowerState(), Mode: buttonService.GetFanMode() };
		
		//this._scope.PushButton = n => this._buttonService.PushButton(this._buttonMap[n]);
		//this._scope.PushButton = this.PushButton;
		this._scope.PushButton = n => this.PushButton(self, n);
		
		this._scope.$watch(s => (<IControllerScope>s).ControlState.Power, (n, o, s) => buttonService.SetPowerState(n));
	
		this._scope.$watch(s => (<IControllerScope>s).ControlState.Mode, (n, o, s) => buttonService.SetFanMode(n));
	}
	
	/**
	 * Handler for a button push.
	 */
	private PushButton(self: ControllerController, name: string) : void
	{
		self._buttonService.PushButton(this._buttonMap[name]);
	}
}

angular.module("IRControlApp").controller("ControllerController", ["$scope", "IRButtons", ControllerController]);

/*angular.module("IRControlApp").controller("ControllerController", ["$scope", "IRButtons",
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
}]);*/