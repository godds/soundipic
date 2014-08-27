angular.module("audio.soundipic", [
  "audio"
])

.factory("soundipic", function(audio) {

  var voices = [];

  var MAX_FREQ = 20000,
      MIN_FREQ = 20;

  var requestID,
      currentStep = 0,
      nextStepTime = 0,
      scheduleAheadTime = 0.1;

  function rgbaToHSVA(rgba) {
    var r = rgba.r / 255,
        g = rgba.g / 255,
        b = rgba.b / 255;

    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max == min) {
      h = 0;
    }
    else {
      switch (max) {
        case r:
          h = ((g - b) / d) % 6;
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h = Math.abs(h) * 60;
    }

    return { h: h, s: s, v: v, a: rgba.a / 255 };
  }

  function imageDataToHSVA(imageData) {
    var result = [];
    for (var i = 0, j = 0; i < imageData.data.length; i += 4) {
      result[j] = rgbaToHSVA({ r: imageData.data[i],
                               g: imageData.data[i+1],
                               b: imageData.data[i+2],
                               a: imageData.data[i+3] });
      j++;
    }
    return result;
  }

  function hsvaToVolume(hsva) {
    return hsva.v;
  }

  function hsvaToSine(hsva) {
    // TODO better
    if (hsva.h <= 60 || hsva.h >= 300) {
      return 1;
    }
    else if (hsva.h <= 120) {
      return 1 - ((hsva.h - 60) / 60);
    }
    else if (hsva.h >= 240) {
      return (hsva.h - 240) / 60;
    }
    return 0;
  }

  function hsvaToSquare(hsva) {
    // TODO better
    if (hsva.h <= 180 && hsva.h >= 60) {
      return 1;
    }
    else if (hsva.h <= 240 && hsva.h > 180) {
      return 1 - ((hsva.h - 180) / 60);
    }
    else if (hsva.h >= 0 && hsva.h < 60) {
      return hsva.h / 60;
    }
    return 0;
  }

  function hsvaToTriangle(hsva) {
    // TODO better
    if (hsva.h <= 300 && hsva.h >= 180) {
      return 1;
    }
    else if (hsva.h <= 360 && hsva.h > 300) {
      return 1 - ((hsva.h - 300) / 60);
    }
    else if (hsva.h >= 120 && hsva.h < 180) {
      return (hsva.h - 120) / 60;
    }
    return 0;
  }

  function hsvaToSaw(hsva) {
    return hsva.s;
  }

  function createVoices(count, hsva) {
    var result = [],
        volCount = hsva.length / count,
        maxFreq = Math.log(MAX_FREQ),
        minFreq = Math.log(MIN_FREQ),
        freqStep = (maxFreq - minFreq) / (count - 1);

    for (var i = count - 1; i >= 0; i--) {
      var freq = 400,//Math.round(Math.exp(minFreq + (i * freqStep))),
          freqVols = hsva.splice(0, volCount),
          gain = audio.createGain(hsvaToVolume(freqVols[0]));
      audio.connect(gain, audio.speakers());

      var sineOsc = audio.createOscillator("sine", freq),
          sineGain = audio.createGain(hsvaToSine(freqVols[0]));
      audio.connect(sineOsc, sineGain, gain);

      var squareOsc = audio.createOscillator("square", freq),
          squareGain = audio.createGain(hsvaToSquare(freqVols[0]));
      audio.connect(squareOsc, squareGain, gain);

      var triangleOsc = audio.createOscillator("triangle", freq),
          triangleGain = audio.createGain(hsvaToTriangle(freqVols[0]));
      audio.connect(triangleOsc, triangleGain, gain);

      var sawOsc = audio.createOscillator("sawtooth", freq),
          sawGain = audio.createGain(hsvaToSaw(freqVols[0]));
      audio.connect(sawOsc, sawGain, gain);

      console.log("h=" + freqVols[0].h + " s=" + freqVols[0].s + " v=" + freqVols[0].v + " a=" + freqVols[0].a);
      console.log("sin=" + sineGain.gain.value + " sq=" + squareGain.gain.value + " tri=" + triangleGain.gain.value + " saw=" + sawGain.gain.value);

      result[i] = { sine: sineOsc,
                    sineGain: sineGain,
                    square: squareOsc,
                    squareGain: squareGain,
                    triangle: triangleOsc,
                    triangleGain: triangleGain,
                    saw: sawOsc,
                    sawGain: sawGain,
                    gain: gain,
                    volumes: freqVols };
    }
    return result;
  }

  function looper() {
    if (nextStepTime < audio.currentTime() + scheduleAheadTime) {
      update(currentStep);
      currentStep++;
    }
    requestID = requestAnimationFrame(looper);
  }

  function update(step) {
    voices.forEach(function(voice) {
      voice.gain.gain.value = hsvaToVolume(voice.volumes[step]);
      voice.sineGain.gain.value = hsvaToSine(voice.volumes[step]);
      voice.squareGain.gain.value = hsvaToSquare(voice.volumes[step]);
      voice.triangleGain.gain.value = hsvaToTriangle(voice.volumes[step]);
      voice.sawGain.gain.value = hsvaToSaw(voice.volumes[step]);

      //console.log("h=" + voice.volumes[step].h + " s=" + voice.volumes[step].s + " v=" + voice.volumes[step].v + " a=" + voice.volumes[step].a);
      //console.log("sin=" + voice.sineGain.gain.value + " sq=" + voice.squareGain.gain.value + " tri=" + voice.triangleGain.gain.value + " saw=" + voice.sawGain.gain.value);
    });
  }

  return {

    play: function(imageData) {
      var hsva = imageDataToHSVA(imageData);
      scheduleAheadTime = 30000 / imageData.width;
      voices = createVoices(1, hsva);//imageData.height, hsva);
      voices.forEach(function(voice) {
        voice.sine.start(0);
        voice.square.start(0);
        voice.triangle.start(0);
        voice.saw.start(0);
      });
      nextStepTime = audio.currentTime();
      looper();
    },

    stop: function() {
      voices.forEach(function(voice) {
        voice.sine.stop(0);
        voice.square.stop(0);
        voice.triangle.stop(0);
        voice.saw.stop(0);
      });
      cancelAnimationFrame(requestID);
    }

  };

})

;
