/// <reference path="../angular.d.ts" />
var FanMode;
(function (FanMode) {
    FanMode[FanMode["Unknown"] = 0] = "Unknown";
    FanMode[FanMode["Cool"] = 1] = "Cool";
    FanMode[FanMode["EnergySaver"] = 2] = "EnergySaver";
    FanMode[FanMode["Fan"] = 3] = "Fan";
})(FanMode || (FanMode = {}));
var Button = (function () {
    function Button() {
    }
    return Button;
})();
var MockButtonService = (function () {
    function MockButtonService(logService) {
        this.$log = logService;
        this.powerState = false;
        this.fanMode = FanMode.Fan;
    }
    MockButtonService.prototype.GetButtons = function () {
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
        ];
    };
    MockButtonService.prototype.PushButton = function (button) {
        this.$log.info("Push button " + button.Label);
    };
    MockButtonService.prototype.GetPowerState = function () {
        return this.powerState;
    };
    MockButtonService.prototype.SetPowerState = function (state) {
        this.$log.debug("SetPowerState: transitioning to " + state);
        this.powerState = state;
    };
    MockButtonService.prototype.GetFanMode = function () {
        return this.fanMode;
    };
    MockButtonService.prototype.SetFanMode = function (mode) {
        this.$log.debug("SetFanMode: transitioning to " + mode);
        this.fanMode = mode;
    };
    return MockButtonService;
})();
angular.module("IRControlApp").service("IRButtons", ["$log", MockButtonService]);
//# sourceMappingURL=buttons.js.map