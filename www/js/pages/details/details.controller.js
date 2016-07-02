(function() {

    "use strict";

    angular.module("pages.details").controller("DetailsController", detailsController);

    detailsController.$inject = ["$scope", "AudioManager"];

    function detailsController($scope, audioManager) {

      //$scope.activate = activate;
      $scope.toggleTrack = audioManager.toggleTrack;

      $scope.$on("$ionicView.enter", function() { audioManager.activate($scope).then(success) });
      $scope.$on("$stateChangeStart", audioManager.resetAudio);
      $scope.$on("playlistTabDeselected", audioManager.resetAudio);

      function success(res) {
        $scope.tracks = res.tracks;
        $scope.loaded = res.loaded;
        $scope.playlist = res.playlist;
        $scope.$broadcast('scroll.refreshComplete');
      }

    }

})();
