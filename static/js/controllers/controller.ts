/// <reference path="../angular.d.ts" />
/// <reference path="../services/buttons.ts" />

/*
Controller for the main button-pusher.
*/

interface IControllerScope extends ng.IScope
{
	ControlState: {
		Power: boolean;
		Mode: FanMode
	};
	Buttons: { [ id: string ]: Button };
	
	PushButton : (name: string) => void;
}

class ControllerController
{
	private _scope: IControllerScope;
	private _log: ng.ILogService;
	private _buttonService: IButtonService;

	private _buttons: Button[];
	private _buttonMap: { [ id: string ]: Button };

	public constructor(scope: IControllerScope, logService: ng.ILogService, buttonService: IButtonService)
	{
		var self = this;

		this._scope = scope;
		this._log = logService;
		this._buttonService = buttonService;
		
		//this._buttons = buttonService.GetButtons();
		this._buttonMap = {};
		this._buttonService.GetButtons().then(buttons =>
			{
				self._buttons = buttons;
				angular.forEach(self._buttons, (br : Button) =>
				{
					self._buttonMap[br.Id] = br;
				});
				self._scope.Buttons = self._buttonMap;
			},
			reason =>
			{
				// TODO display error to user
				this._scope.Buttons = {};
			});
		
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
		self._buttonService.PushButton(this._buttonMap[name]).then(v =>
			{
				this._log.info("Pushed button " + name + " successfully");
			},
			reason =>
			{
				var msg = "Could not push button " + name + ": " + reason;
				alert(msg);
				this._log.warn(msg);
			});
	}
}

angular.module("IRControlApp").controller("ControllerController", ["$scope", "$log", "IRButtons", ControllerController]);
