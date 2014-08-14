angular.module("soundipic.pick", [
  "ui.router",
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

  $scope.file = null;

  $scope.upload = function() {

    // TODO better way of handling this?
    if (!$scope.file) {
      console.log("no file selected");
      return;
    }
    if (!$scope.file.type.match(/image.*/)) {
      console.log("file must be image");
      return;
    }

    var reader = new FileReader();
    reader.onload = readFile;
    reader.readAsDataURL($scope.file);
  };
})

.directive("imageInput", function($parse) {
  return {
    restrict: "E",
    template: "<input type='file' accept='images/*' />",
    replace: true,
    link: function(scope, element, attrs) {
      var modelGet = $parse(attrs.file);
      var modelSet = modelGet.assign;
      var onChange = $parse(attrs.onchange);

      var updateModel = function() {
        scope.$apply(function() {
          modelSet(scope, element[0].files[0]);
          onChange(scope);
        });
      };

      element.bind("change", updateModel);
    }
  };
})

;
