(function() {

    "use strict";

    angular.module("pages.list").controller("ListController", listController);

    listController.$inject = ["$scope", "PlaylistService", "$timeout", "$ionicListDelegate", "$ionicPopup"];

    function listController($scope, playlistService, $timeout, $ionicListDelegate, $ionicPopup) {

      $scope.remove = remove;
      $scope.activate = activate;

      $scope.$on("$ionicView.enter", activate);

      function remove(item) {

        var confirmPopup = $ionicPopup.confirm({
          title: 'Remove playlist',
          template: 'Are you sure you want to remove ' + item.title + '?'
        });

        confirmPopup.then(function(res) {
          if(res) {
            $scope.playlists = playlistService.remove(item);
          }
        }).finally(function() {
          $ionicListDelegate.closeOptionButtons();
        });

      }

      function activate() {
        $scope.loaded = false;
        $timeout(function(){
          $scope.playlists = playlistService.get();
          $scope.loaded = true;
        }, 1000);
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      }

    }


})();
