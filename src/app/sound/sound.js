angular.module("soundipic.sound", [
  "ui.router",
  "audio",
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

.controller("SoundCtrl", function SoundController($scope, model, audio, soundipic) {
    $scope.playing = false;
    $scope.imageSrc = model.imageSrc();
    $scope.volume = audio.masterVolume();

    function adjustVolume(delta) {
      audio.masterVolume(audio.masterVolume() + delta);
      $scope.volume = audio.masterVolume();
    }

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

    $scope.volumeDown = function() {
      adjustVolume(-0.1);
    };
    $scope.volumeUp = function() {
      adjustVolume(0.1);
    };
})

;
