(function() {

    "use strict";

    angular.module("pages.list").controller("ListController", listController);

    listController.$inject = ["$scope", "PlaylistService"];

    function listController($scope, playlistService) {

      $scope.remove = remove;
      $scope.activate = activate;

      $scope.$on("$ionicView.enter", function(e) {
        activate();
      });

      function remove(item) {
        $scope.playlists = playlistService.remove(item);
      }

      function activate() {
        $scope.loaded = false;
        $scope.playlists = playlistService.get();
        $scope.loaded = true;
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      }

    }


})();
