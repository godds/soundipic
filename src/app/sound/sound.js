angular.module("soundipic.sound", [
  "ui.router",
  "audio.soundipic",
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

.controller("SoundCtrl", function SoundController($scope, model, soundipic) {
    $scope.playing = false;
    $scope.imageSrc = model.imageSrc();

    $scope.togglePlaying = function() {
      if ($scope.playing) {
        soundipic.stop();
        $scope.playing = false;
      }
      else {
        soundipic.play(model.imageData());
        $scope.playing = true;
      }
    };
})

;
