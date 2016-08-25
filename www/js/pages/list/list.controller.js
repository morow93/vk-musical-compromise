(function() {

    "use strict";

    angular.module("pages.list").controller("ListController", listController);

    listController.$inject = ["$scope", "PlaylistService", "$timeout", "$ionicListDelegate", "$ionicPopup"];

    function listController($scope, playlistService, $timeout, $ionicListDelegate, $ionicPopup) {

      $scope.remove = remove;
      $scope.activate = activate;

      $scope.$on("$ionicView.enter", activate);

      $scope.$on('$stateChangeSuccess', function(){
        $ionicListDelegate.closeOptionButtons();
      });

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

      function activate(refreshing) {

        $scope.loaded = false;
        $scope.refreshing = refreshing === true;

        $timeout(function(){
          $scope.playlists = playlistService.get();
          $scope.loaded = true;
        }, 500);

        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      }

    }


})();
