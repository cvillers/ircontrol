/// <reference path="angular.d.ts" />
/// <reference path="angular-route.d.ts" />
/// <reference path="angular-material.d.ts" />
var app = angular.module("IRControlApp", ["ng", "ngMaterial", "ngRoute"]);
var PageDefinition = (function () {
    function PageDefinition() {
    }
    return PageDefinition;
})();
var navLinks = [
    { Title: "Control", URL: "control", Template: "control.html", Controller: "ControllerController" },
    { Title: "Schedule", URL: "schedule", Template: "schedule.html", Controller: "ScheduleController" }
];
app.config(["$routeProvider", function ($routeProvider) {
        angular.forEach(navLinks, function (link) {
            $routeProvider.when("/" + link.URL, {
                templateUrl: "templates/" + link.Template,
                resolve: { PageDefinition: function () { return link; } }
            });
        });
        $routeProvider.otherwise("/control");
    }]);
//# sourceMappingURL=appts.js.map