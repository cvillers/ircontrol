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

interface IButtonService
{
	GetButtons(): Button[];
	
	PushButton(button: Button): void;
	
	GetPowerState() : boolean;
	SetPowerState(boolean);

	GetFanMode() : FanMode;
	SetFanMode(FanMode);
}

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
		return
		[
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
		this.$log.info("Pushed button " + button.Label);
	}
	
	public GetPowerState() : boolean
	{
		return this.powerState;
	}
	
	public SetPowerState(state: boolean)
	{
		this.powerState = state;
	}

	public GetFanMode() : FanMode
	{
		return this.fanMode;
	}
	
	public SetFanMode(mode: FanMode)
	{
		this.fanMode = mode;
	}
}

angular.module("IRControlApp").service("IRButtons", ["$log", MockButtonService]);