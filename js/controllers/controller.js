/// <reference path="../angular.d.ts" />
/// <reference path="../services/buttons.ts" />
var ControllerController = (function () {
    function ControllerController(scope, buttonService) {
        var _this = this;
        var self = this;
        this._scope = scope;
        this._buttonService = buttonService;
        this._buttons = buttonService.GetButtons();
        this._buttonMap = {};
        angular.forEach(this._buttons, function (br) {
            _this._buttonMap[br.Id] = br;
        });
        this._scope.Buttons = this._buttonMap;
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
        self._buttonService.PushButton(this._buttonMap[name]);
    };
    return ControllerController;
})();
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
//# sourceMappingURL=controller.js.map