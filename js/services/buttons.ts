/// <reference path="../angular.d.ts" />

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
 * Service for pushing virtual buttons.
 */
interface IButtonService
{
	/**
	 * Gets the button definitions.
	 */
	GetButtons(): Button[];
	
	/**
	 * Sends a button-push command.
	 */
	PushButton(button: Button): void;
	
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

	private powerState: boolean;
	private fanMode: FanMode;

	public constructor(logService: ng.ILogService)
	{
		this.$log = logService;
		this.powerState = false;
		this.fanMode = FanMode.Fan;
	}
	
	public GetButtons(): Button[]
	{
		return [
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
		]
	}
	
	public PushButton(button: Button): void
	{
		this.$log.info("Push button " + button.Label);
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

angular.module("IRControlApp").service("IRButtons", ["$log", MockButtonService]);