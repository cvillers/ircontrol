/// <reference path="../angular.d.ts" />
/// <reference path="../services/buttons.ts" />
var ControllerController = (function () {
    function ControllerController(scope, logService, buttonService) {
        var _this = this;
        var self = this;
        this._scope = scope;
        this._log = logService;
        this._buttonService = buttonService;
        //this._buttons = buttonService.GetButtons();
        this._buttonMap = {};
        this._buttonService.GetButtons().then(function (buttons) {
            self._buttons = buttons;
            angular.forEach(self._buttons, function (br) {
                self._buttonMap[br.Id] = br;
            });
            self._scope.Buttons = self._buttonMap;
        }, function (reason) {
            // TODO display error to user
            _this._scope.Buttons = {};
        });
        this._scope.ControlState = { Power: buttonService.GetPowerState(), Mode: buttonService.GetFanMode() };
        //this._scope.PushButton = n => this._buttonService.PushButton(this._buttonMap[n]);
        //this._scope.PushButton = this.PushButton;
        this._scope.PushButton = function (n) { return _this.PushButton(self, n); };
        this._scope.$watch(function (s) { return s.ControlState.Power; }, function (n, o, s) { return buttonService.SetPowerState(n); });
        this._scope.$watch(function (s) { return s.ControlState.Mode; }, function (n, o, s) { return buttonService.SetFanMode(n); });
    }
    /**
     * Handler for a button push.
     */
    ControllerController.prototype.PushButton = function (self, name) {
        var _this = this;
        self._buttonService.PushButton(this._buttonMap[name]).then(function (v) {
            _this._log.info("Pushed button " + name + " successfully");
        }, function (reason) {
            _this._log.warn("Could not push button " + name + ": " + reason);
        });
    };
    return ControllerController;
})();
angular.module("IRControlApp").controller("ControllerController", ["$scope", "$log", "IRButtons", ControllerController]);
