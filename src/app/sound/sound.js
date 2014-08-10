angular.module("soundipic.sound", [
    "ui.state"
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
