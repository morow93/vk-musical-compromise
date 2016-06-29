(function() {

    "use strict";

    angular.module("pages.details").controller("DetailsController", detailsController);

    detailsController.$inject = ["$q", "$scope", "$ionicPopup", "FriendService", "AuthService", "ToastService",
    "PlaylistService", "$state", "$timeout", "$stateParams", "AudioService", "BaseHttpService"];

    function detailsController($q, $scope, $ionicPopup, friendService, authService, toastService,
      playlistService, $state, $timeout, $stateParams, audioService, baseHttpService) {

      $scope.activate = activate;
      $scope.toggleTrack = toggleTrack;

      $scope.$on("$ionicView.enter", function(e) {
        activate();
      });

      // begin: move to service

      function toggleTrack(track) {

        if ($scope.currentTrack.aid !== track.aid){
          $scope.currentTrack.playing = false;
        }
        track.playing = !track.playing;
        var previousTrack = angular.copy($scope.currentTrack);
        $scope.currentTrack = track;

        if ($scope.currentTrack.aid === previousTrack.aid){
          if(!$scope.currentAudio){
            $scope.currentAudio = new Audio(track.url);
            $scope.currentAudio.addEventListener("ended", continueToPlay);
          }
          if (track.playing){
            $scope.currentAudio.play();
          }else{
            $scope.currentAudio.pause();
          }
        }else{
          if ($scope.currentAudio){
            $scope.currentAudio.pause();
          }
          if (track.playing){
            $scope.currentAudio = new Audio(track.url);
            $scope.currentAudio.addEventListener("ended", continueToPlay);
            $scope.currentAudio.play();
          }else{
            $scope.currentAudio.pause();
          }
        }

      }

      function continueToPlay() {

        $scope.$apply(function(){
          $scope.currentTrack.playing = false;
          var nextTrackIndex = -1;
          angular.forEach($scope.tracks, function(value, key) {
              if ($scope.currentTrack.aid === value.aid){
                nextTrackIndex = (key + 1);
              }
          });
          if ($scope.tracks[nextTrackIndex]){
            $scope.currentTrack = $scope.tracks[nextTrackIndex];
            $scope.currentTrack.playing = true;
            $scope.currentAudio = new Audio($scope.tracks[nextTrackIndex].url);
            $scope.currentAudio.addEventListener("ended", continueToPlay);
            $scope.currentAudio.play();
          }
        });

      }

      function resetAudio() {
        $scope.currentTrack = {};
        if ($scope.currentAudio){
          $scope.currentAudio.pause();
        }
        $scope.currentAudio = null;
      }

      // end: move to service

      function activate() {

        resetAudio();
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

        baseHttpService.run(function() {
          return $scope.playlist.friends.map(function(item) {
            return audioService.get(item.uid);
          });
        }).then(function(res) {
          $scope.tracks = audioService.mix(res);
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
