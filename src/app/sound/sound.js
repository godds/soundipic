angular.module("soundipic.sound", [
  "ui.router",
  "soundipic.model"
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

.controller("SoundCtrl", function SoundController($scope, model) {
    $scope.title = "Sound";

    $scope.imageSrc = model.imageData;
})

;
