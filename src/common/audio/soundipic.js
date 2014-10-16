angular.module("audio.soundipic", [
  "audio"
])

.factory("soundipic", function($rootScope, audio) {

  var voices = [];

  var MAX_FREQ = 20000,
      MIN_FREQ = 20;

  var requestID,
      currentStep = 0,
      nextStepTime = 0,
      steps = 0,
      scheduleAheadTime = 0.1;

  function imageDataToRGBA(imageData) {
    var result = [];
    for (var i = 0, j = 0; i < imageData.data.length; i += 4) {
      result[j] = { r: imageData.data[i],
                    g: imageData.data[i+1],
                    b: imageData.data[i+2],
                    a: imageData.data[i+3] };
      j++;
    }
    return result;
  }

  function rgbaToVolume(rgba) {
    return rgba.map(function(item) {
      // getBrightness from tinycolor library
      return ((item.r * 299 + item.g * 587 + item.b * 114) / 1000) / 255;
    });
  }

  function createVoices(count, volumes) {
    var result = [],
        volCount = volumes.length / count,
        maxFreq = Math.log(MAX_FREQ),
        minFreq = Math.log(MIN_FREQ),
        freqStep = (maxFreq - minFreq) / (count - 1);
    for (var i = count - 1; i >= 0; i--) {
      var noteVols = volumes.splice(0, volCount),
          osc = audio.createOscillator("sine", Math.round(Math.exp(minFreq + (i * freqStep)))),
          gain = audio.createGain(noteVols[0]);
      audio.connect(osc, gain, audio.speakers());
      result[i] = { osc: osc, gain: gain, volumes: noteVols };
    }
    return result;
  }

  function looper() {
    if (nextStepTime < audio.currentTime() + scheduleAheadTime) {
      updateVolume(currentStep);
      currentStep++;
    }
    if (currentStep < steps) {
      requestID = requestAnimationFrame(looper);
    }
    else {
      stop();
    }
  }

  function updateVolume(step) {
    voices.forEach(function(voice) {
      voice.gain.gain.value = voice.volumes[step];
    });
  }

  function play(imageData) {
    currentStep = 0;
    steps = imageData.width;
    var rgba = imageDataToRGBA(imageData),
        volumes = rgbaToVolume(rgba);
    scheduleAheadTime = 30000 / steps;
    voices = createVoices(imageData.height, volumes);
    $rootScope.$emit("playing", true);
    voices.forEach(function(voice) {
      voice.osc.start(0);
    });
    nextStepTime = audio.currentTime();
    looper();
  }

  function stop() {
    $rootScope.$emit("playing", false);
    cancelAnimationFrame(requestID);
    requestID = null;
    voices.forEach(function(voice) {
      voice.osc.stop(0);
    });
  }

  return {
    play: play,
    stop: stop
  };

})

;
