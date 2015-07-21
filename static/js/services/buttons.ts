/// <reference path="../angular.d.ts" />
/// <reference path="../ircontrol.d.ts" />

enum FanMode
{
	Unknown,
	Cool,
	EnergySaver,
	Fan
}

class Button
{
	public Id: string;
	public Label: string;
}

/**
 * This result is returned from the server for the list of buttons.
 */
class GetButtonsResult
{
	success: boolean;
	message: string;
	buttons: Button[];
}

/**
 * This result is returned from the server after a button-push operation.
 */
class PushButtonResult
{
	success: boolean;
	message: string;
}

/**
 * Service for pushing virtual buttons.
 */
interface IButtonService
{
	/**
	 * Gets the button definitions.
	 * 
	 * @returns A promise with the button results.
	 */
	GetButtons(): ng.IPromise<Button[]>;
	
	/**
	 * Sends a button-push command.
	 * 
	 * @returns A promise which succeeds if the request succeeds or returns the error message on failure.
	 */
	PushButton(button: Button): ng.IPromise<void>;
	
	/**
	 * Gets the unit's current power state.
	 */
	GetPowerState() : boolean;
	
	/**
	 * Sets the new power state for the unit.
	 */
	SetPowerState(boolean);

	/**
	 * Gets the unit's current fan mode.
	 */
	GetFanMode() : FanMode;
	
	/**
	 * Sets the new fan mode for the unit.
	 */
	SetFanMode(FanMode);
}

/**
 * A button service which only pretends to work.
 */
class MockButtonService implements IButtonService
{
	private $log : ng.ILogService;
	private $q: ng.IQService;
	private $timeout: ng.ITimeoutService;

	private powerState: boolean;
	private fanMode: FanMode;

	public constructor(logService: ng.ILogService, qService: ng.IQService, timeoutService: ng.ITimeoutService)
	{
		this.$log = logService;
		this.$q = qService;
		this.$timeout = timeoutService;
		this.powerState = false;
		this.fanMode = FanMode.Fan;
	}
	
	public GetButtons(): ng.IPromise<Button[]>
	{
		return this.$q.when([
			{
				Id: "fan_speed_up",
				Label: "Fan \u2191"
			},
			{
				Id: "fan_speed_down",
				Label: "Fan \u2193"
			},
			{
				Id: "temp_up",
				Label: "Temp \u2191"
			},
			{
				Id: "temp_down",
				Label: "Temp \u2193"
			}
		]);
	}
	
	public PushButton(button: Button): ng.IPromise<void>
	{
		this.$log.info("Push button " + button.Label);
		
		var future = this.$q.defer<void>();
		
		this.$timeout(() => {}, (Math.random() + 0.01) * 5).then(() =>
			{
				if(Math.random() < 0.25)
				{
					var result = new PushButtonResult();
					result.success = false;
					future.reject("Request failed")
				}
				else
				{
					var result = new PushButtonResult();
					//result.success = true;
					//promise.resolve(result);
					future.resolve();
				}
				
			});
		
		return future.promise;
	}
	
	public GetPowerState() : boolean
	{
		return this.powerState;
	}
	
	public SetPowerState(state: boolean)
	{
		this.$log.debug("SetPowerState: transitioning to " + state);
		this.powerState = state;
		// TODO push power button
	}

	public GetFanMode() : FanMode
	{
		return this.fanMode;
	}
	
	public SetFanMode(mode: FanMode)
	{
		this.$log.debug("SetFanMode: transitioning to " + mode);
		this.fanMode = mode;
		// TODO push appropriate button
	}
}

/**
 * A button service which is fully dependent on the remote server for the definitions.
 */
class ServerButtonService implements IButtonService
{
	private _log: ng.ILogService;
	private _http: ng.IHttpService;
	private _q: ng.IQService;

	public constructor(logService: ng.ILogService, httpService: ng.IHttpService, qService: ng.IQService)
	{
		//console.debug("got " + logService + " " + httpService + " " + qService);
		this._log = logService;
		this._http = httpService;
		this._q = qService;
	}

	/**
	 * Gets the button definitions.
	 */
	public GetButtons(): ng.IPromise<Button[]>
	{
		var future = this._q.defer<Button[]>();
		this._http.get<GetButtonsResult>(APP_GLOBAL_CONFIG.API.GetButtons)
			.success(res =>
			{
				//if(res.)
				future.resolve(res.buttons);
			})
			.error(res =>
			{
				future.reject(res);
			});

		return future.promise;
	}
	
	/**
	 * Sends a button-push command.
	 */
	public PushButton(button: Button): ng.IPromise<void>
	{
		return this._q.when<void>(null);
	}
	
	/**
	 * Gets the unit's current power state.
	 */
	public GetPowerState() : boolean
	{
		return true;
	}
	
	/**
	 * Sets the new power state for the unit.
	 */
	public SetPowerState(boolean)
	{
		
	}

	/**
	 * Gets the unit's current fan mode.
	 */
	public GetFanMode() : FanMode
	{
		return null;
	}
	
	/**
	 * Sets the new fan mode for the unit.
	 */
	public SetFanMode(FanMode)
	{
		
	}
}

//angular.module("IRControlApp").service("IRButtons", ["$log", "$q", "$timeout", MockButtonService]);
angular.module("IRControlApp").service("IRButtons", ["$log", "$http", "$q", ServerButtonService]);