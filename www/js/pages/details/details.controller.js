(function() {

    "use strict";

    angular.module("pages.details").controller("DetailsController", detailsController);

    detailsController.$inject = ["$q", "$scope", "$ionicPopup", "FriendService", "AuthService", "ToastService",
    "PlaylistService", "$state", "$timeout", "$stateParams", "AudioService", "BaseHttpService"];

    function detailsController($q, $scope, $ionicPopup, friendService, authService, toastService,
      playlistService, $state, $timeout, $stateParams, audioService, baseHttpService) {

      $scope.activate = activate;
      $scope.toggleTrack = toggleTrack;

      $scope.$on("$ionicView.enter", activate);
      $scope.$on("$stateChangeStart", resetAudio);
      $scope.$on("playlistTabDeselected", resetAudio);

      function toggleTrack(track, index) {

          if ($scope.currentTrack.index !== index){
            // Disable previous track
            $scope.currentTrack.playing = false;
          }
          track.playing = !track.playing;
          var previousTrack = angular.copy($scope.currentTrack);
          $scope.currentTrack = track;
          $scope.currentTrack.index = index;

          if ($scope.currentTrack.index === previousTrack.index){
            if(!$scope.currentAudio){
              $scope.currentAudio = new Audio(track.url);
              $scope.currentAudio.addEventListener("ended", continueToPlay);
              $scope.currentAudio.addEventListener("error", continueToPlay);
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
              $scope.currentAudio.addEventListener("error", continueToPlay);
              $scope.currentAudio.play();
            }else{
              $scope.currentAudio.pause();
            }
          }

          function continueToPlay() {
              $scope.$apply(function(){
                $scope.currentTrack.playing = false;
                var nextTrackIndex = $scope.currentTrack.index + 1;

                if ($scope.tracks[nextTrackIndex]){
                  $scope.currentTrack = $scope.tracks[nextTrackIndex];
                  $scope.currentTrack.playing = true;
                  $scope.currentTrack.index = nextTrackIndex;

                  $scope.currentAudio = new Audio($scope.tracks[nextTrackIndex].url);
                  $scope.currentAudio.addEventListener("ended", continueToPlay);
                  $scope.currentAudio.addEventListener("error", continueToPlay);
                  $scope.currentAudio.play();
                }
              });
          }

      }

      function resetAudio() {
        // "Pointer" to current playing track
        $scope.currentTrack = {};
        if ($scope.currentAudio){
          $scope.currentAudio.pause();
        }
        // Will be audio object
        $scope.currentAudio = null;
      }

      function activate() {

        resetAudio();
        $scope.loaded = false;

        if (!angular.isDefined($stateParams.playlistId)) {
          $scope.tracks = null;
          $scope.loaded = true;
          toastService.show("Can not load playlist");
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
          return;
        };

        $scope.playlist = playlistService.get($stateParams.playlistId);
        if (!$scope.playlist || !$scope.playlist.friends) {
          $scope.tracks = null;
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
          $scope.tracks = null;
          toastService.show("Can not load playlist");
        }).finally(function() {
          $scope.loaded = true;
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });

      }

    }

})();
