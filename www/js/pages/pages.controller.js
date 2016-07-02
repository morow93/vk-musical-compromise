(function() {

    "use strict";

    angular.module("app.pages").controller("PagesController", pagesController);

    pagesController.$inject = ["$scope", "ToastService", "AudioManager"];

    function pagesController($scope, toastService, audioManager) {

      $scope.onPlaylistTabDeselected = onPlaylistTabDeselected;
      $scope.getCurrentTrack = audioManager.getCurrentTrack;
      $scope.toggleTrack = audioManager.toggleTrack;

      function onPlaylistTabDeselected() {
        $scope.$broadcast("playlistTabDeselected");
      }

    }

})();
