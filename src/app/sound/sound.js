angular.module("soundipic.sound", [
    "ui.router"
])

.config(function config($stateProvider) {
    $stateProvider.state("sound", {
        url: "/sound",
        views: {
            "main": {
                controller: "SoundCtrl",
                templateUrl: "sound/sound.tpl.html"
            }
        }
    });
})

.controller("SoundCtrl", function SoundController($scope) {
    $scope.title = "Sound";
})

;
