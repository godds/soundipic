angular.module("soundipic.pick", [
  "ui.router",
  "angularFileUpload",
  "soundipic.model"
])

.config(function config($stateProvider) {
  $stateProvider.state("pick", {
    url: "/pick",
    views: {
      "main": {
        controller: "PickCtrl",
        templateUrl: "pick/pick.tpl.html"
      }
    }
  });
})

.controller("PickCtrl", function PickController($scope, $state, model) {

  function readFile(event) {
    model.imageSrc(event.target.result);
    $state.go("sound");
  }

  $scope.onFileSelect = function(files) {
    // TODO better way of handling this?
    if (!files || !files.length) {
      console.log("no file selected");
      return;
    }
    var file = files[0];
    if (!file.type.match(/image.*/)) {
      console.log("file must be image");
      return;
    }

    var reader = new FileReader();
    reader.onload = readFile;
    reader.readAsDataURL(file);
  };

  $scope.dragOverClass = function(event) {
    var items = $event.dataTransfer.items;
		var hasFile = false;
		if (items && items.length) {
			for (var i = 0 ; i < items.length; i++) {
				if (items[i].kind == 'file') {
					hasFile = true;
					break;
				}
			}
		} else {
			hasFile = true;
		}
		return hasFile ? "dragover" : "dragover-err";
  };
})

;
