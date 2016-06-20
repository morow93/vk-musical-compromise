(function() {

    "use strict";

    angular.module("pages.list").controller("ListController", listController);

    listController.$inject = ["$scope", "PlaylistService"];

    function listController($scope, playlistService) {

      $scope.remove = remove;
      $scope.togglePlaylist = togglePlaylist;
      $scope.isPlaylistShown = isPlaylistShown;

      $scope.$on("$ionicView.enter", function(e) {

        $scope.loaded = false;
        $scope.playlists = playlistService.get();
        $scope.loaded = true;

      });

      function remove(item) {
        $scope.playlists = playlistService.remove(item);
      }

      function togglePlaylist(playlist) {
        if ($scope.isPlaylistShown(playlist)) {
          $scope.shownPlaylist = null;
        } else {
          $scope.shownPlaylist = playlist;
        }
      }

      function isPlaylistShown(playlist) {
        return $scope.shownPlaylist === playlist;
      }

    }


})();
