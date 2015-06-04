/// <reference path="../angular.d.ts" />
/// <reference path="../services/buttons.ts" />
angular.module("IRControlApp").controller("ControllerController", ["$scope", "buttonService",
    function ($scope, buttonService) {
        var buttonRecords = buttonService.GetButtons();
        console.dir(buttonRecords);
        $scope.Buttons = {};
        angular.forEach(buttonRecords, function (br) {
            $scope.Buttons[br.Id] = br;
        });
        $scope.State = { Power: buttonService.GetPowerState(), Mode: buttonService.GetFanMode() };
    }]);
//# sourceMappingURL=controller.js.map