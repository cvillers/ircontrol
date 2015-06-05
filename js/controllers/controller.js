/// <reference path="../angular.d.ts" />
/// <reference path="../services/buttons.ts" />
angular.module("IRControlApp").controller("ControllerController", ["$scope", "IRButtons",
    function ($scope, buttonService) {
        var buttonRecords = buttonService.GetButtons();
        $scope.Buttons = {};
        angular.forEach(buttonRecords, function (br) {
            $scope.Buttons[br.Id] = br;
        });
        $scope.ControlState = { Power: buttonService.GetPowerState(), Mode: buttonService.GetFanMode() };
        $scope.$watch(function (s) { return s.ControlState.Power; }, function (n, o, s) { return buttonService.SetPowerState(n); });
        $scope.$watch(function (s) { return s.ControlState.Mode; }, function (n, o, s) { return buttonService.SetFanMode(n); });
        $scope.PushButton = function (name) {
            buttonService.PushButton($scope.Buttons[name]);
        };
    }]);
//# sourceMappingURL=controller.js.map