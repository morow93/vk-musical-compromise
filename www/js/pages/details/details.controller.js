(function() {

    "use strict";

    angular.module("pages.details").controller("DetailsController", detailsController);

    detailsController.$inject = ["$q", "$scope", "$ionicPopup", "FriendService", "AuthService", "ToastService",
    "PlaylistService", "$state", "$timeout", "$stateParams", "AudioService", "BaseHttpService"];

    function detailsController($q, $scope, $ionicPopup, friendService, authService, toastService,
      playlistService, $state, $timeout, $stateParams, audioService, baseHttpService) {

      $scope.activate = activate;

      function activate() {

        $scope.loaded = false;

        if (!angular.isDefined($stateParams.playlistId)) {
          $scope.loaded = true;
          toastService.show("Can not load playlist");
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
          return;
        };

        $scope.playlist = playlistService.get($stateParams.playlistId);
        if (!$scope.playlist || !$scope.playlist.friends) {
          $scope.loaded = true;
          toastService.show("Can not load playlist");
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
          return;
        }

        var functions = [];
        angular.forEach($scope.playlist.friends, function (value, key) {
          functions.push(audioService.get(value.uid));
        });

        baseHttpService.run(function(){
          return functions;
        }).then(function(res) {     
          $scope.audios = res;
        }).catch(function(err) {
          toastService.show("Can not load playlist");
        }).finally(function() {
          $scope.loaded = true;
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });

      }

    }

})();
