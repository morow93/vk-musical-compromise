(function() {

    "use strict";

    angular.module("pages.details").controller("DetailsController", detailsController);

    detailsController.$inject = ["$scope", "AudioManager"];

    function detailsController($scope, audioManager) {

      $scope.openPopoverMembers = audioManager.openPopoverMembers;
      $scope.toggleTrack = audioManager.toggleTrack;

      $scope.$on("$ionicView.enter", function() {
        audioManager.activate($scope);
      });
      $scope.$on("$stateChangeStart", function() {
        audioManager.resetState();
      });
      $scope.$on("playlistTabDeselected", function() {
        audioManager.resetState();
      });

    }

})();
