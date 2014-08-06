function AppViewModel() {
  var that = this;

  this.showSelector = ko.observable(true);
  this.showPlayer = ko.observable(false);

  this.fileSelected = function(event) {
    var files = event.target.files;

    for (var i = 0; i < files.length; i++) {

      if (files[i].type.match(/image.*/)) {

        var reader = new FileReader();
        reader.onload = function(readerEvent) {
          var image = new Image();
          image.src = readerEvent.target.result;

          var width = image.width,
              height = image.height;

          var canvas = document.querySelector(".sound canvas.pic");
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(image, 0, 0, width, height);

          that.showSelector(false);
          that.showPlayer(true);
        }

        reader.readAsDataURL(files[i]);

      }

    }
  };
}
