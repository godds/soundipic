angular.module("soundipic.pick", [
    "ui.state"
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

.controller("PickCtrl", function PickController($scope) {
    $scope.title = "pick";
})

;
