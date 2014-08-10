angular.module("soundipic", [
        "templates-app",
        "templates-common",
        "ui.state",
        "ui.route",
        "soundipic.pick",
        "soundipic.sound"
    ])

    .config(function myAppConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/pick");
    })

    .run(function run() {

    })

    .controller("AppCtrl", function AppCtrl($scope, $location) {
    })

;
