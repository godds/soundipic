angular.module("soundipic.model", [

])

.service("model", function() {

  var imageSrc,
      imageData;

  function srcToData(src) {
    var image = new Image();
    image.src = imageSrc;

    var width = image.width,
        height = image.height;

    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, width, height);
    return context.getImageData(0, 0, width, height);
  }

  function dataToSrc(data) {
    var canvas = document.createElement("canvas"),
        context = canvas.getContext("2d");
    context.putImageData(data, 0, 0);
    return canvas.toDataURL("image/jpg");
  }

  function getImageData() {
    if (!imageSrc) {
      return null;
    }

  }

  return {
    imageSrc: function(src) {
      if (src) {
        imageSrc = src;
        imageData = srcToData(src);
      }
      return imageSrc;
    },
    imageData: function(data) {
      if (data) {
        imageData = data;
        imageSrc = dataToSrc(data);
      }
      return imageData;
    }
  };
})

;
