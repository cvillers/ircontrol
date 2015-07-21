/// <reference path="../angular.d.ts" />
/// <reference path="../ircontrol.d.ts" />
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
/**
 * This result is returned from the server for the list of buttons.
 */
var GetButtonsResult = (function () {
    function GetButtonsResult() {
    }
    return GetButtonsResult;
})();
/**
 * This result is returned from the server after a button-push operation.
 */
var PushButtonResult = (function () {
    function PushButtonResult() {
    }
    return PushButtonResult;
})();
/**
 * A button service which only pretends to work.
 */
var MockButtonService = (function () {
    function MockButtonService(logService, qService, timeoutService) {
        this.$log = logService;
        this.$q = qService;
        this.$timeout = timeoutService;
        this.powerState = false;
        this.fanMode = 3 /* Fan */;
    }
    MockButtonService.prototype.GetButtons = function () {
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
    };
    MockButtonService.prototype.PushButton = function (button) {
        this.$log.info("Push button " + button.Label);
        var future = this.$q.defer();
        this.$timeout(function () {
        }, (Math.random() + 0.01) * 5).then(function () {
            if (Math.random() < 0.25) {
                var result = new PushButtonResult();
                result.success = false;
                future.reject("Request failed");
            }
            else {
                var result = new PushButtonResult();
                //result.success = true;
                //promise.resolve(result);
                future.resolve();
            }
        });
        return future.promise;
    };
    MockButtonService.prototype.GetPowerState = function () {
        return this.powerState;
    };
    MockButtonService.prototype.SetPowerState = function (state) {
        this.$log.debug("SetPowerState: transitioning to " + state);
        this.powerState = state;
        // TODO push power button
    };
    MockButtonService.prototype.GetFanMode = function () {
        return this.fanMode;
    };
    MockButtonService.prototype.SetFanMode = function (mode) {
        this.$log.debug("SetFanMode: transitioning to " + mode);
        this.fanMode = mode;
        // TODO push appropriate button
    };
    return MockButtonService;
})();
/**
 * A button service which is fully dependent on the remote server for the definitions.
 */
var ServerButtonService = (function () {
    function ServerButtonService(logService, httpService, qService) {
        //console.debug("got " + logService + " " + httpService + " " + qService);
        this._log = logService;
        this._http = httpService;
        this._q = qService;
    }
    /**
     * Gets the button definitions.
     */
    ServerButtonService.prototype.GetButtons = function () {
        var future = this._q.defer();
        this._http.get(APP_GLOBAL_CONFIG.API.GetButtons).success(function (res) {
            //if(res.)
            future.resolve(res.buttons);
        }).error(function (res) {
            future.reject(res);
        });
        return future.promise;
    };
    /**
     * Sends a button-push command.
     */
    ServerButtonService.prototype.PushButton = function (button) {
        return this._q.when(null);
    };
    /**
     * Gets the unit's current power state.
     */
    ServerButtonService.prototype.GetPowerState = function () {
        return true;
    };
    /**
     * Sets the new power state for the unit.
     */
    ServerButtonService.prototype.SetPowerState = function (boolean) {
    };
    /**
     * Gets the unit's current fan mode.
     */
    ServerButtonService.prototype.GetFanMode = function () {
        return null;
    };
    /**
     * Sets the new fan mode for the unit.
     */
    ServerButtonService.prototype.SetFanMode = function (FanMode) {
    };
    return ServerButtonService;
})();
//angular.module("IRControlApp").service("IRButtons", ["$log", "$q", "$timeout", MockButtonService]);
angular.module("IRControlApp").service("IRButtons", ["$log", "$http", "$q", ServerButtonService]);
