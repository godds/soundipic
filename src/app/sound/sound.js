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

.controller("SoundCtrl", function SoundController($scope, $rootScope, model, audio, soundipic) {
    var MAX_VOL = 0.1,
        MIN_VOL = 0.01;
    audio.masterVolume(MAX_VOL);

    $scope.playing = false;
    $scope.imageSrc = model.imageSrc();
    $scope.volume = audio.masterVolume() * 100;

    function adjustVolume(delta) {
      audio.masterVolume(Math.max(Math.min(audio.masterVolume() + delta, MAX_VOL), MIN_VOL));
      $scope.volume = audio.masterVolume() * 100;
    }

    $scope.togglePlaying = function() {
      if ($scope.playing) {
        soundipic.stop();
      }
      else {
        soundipic.play(model.imageData());
      }
    };

    $scope.volumeDown = function() {
      adjustVolume(-0.01);
    };
    $scope.volumeUp = function() {
      adjustVolume(0.01);
    };

    $rootScope.$on("playing", function(event, isPlaying) {
      $scope.playing = isPlaying;
      $scope.$apply();
    });
})

;
