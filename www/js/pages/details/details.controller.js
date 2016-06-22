(function() {

    "use strict";

    angular.module("pages.details").controller("DetailsController", detailsController);

    detailsController.$inject = ["$q", "$scope", "$ionicPopup", "FriendService", "AuthService", "ToastService", "PlaylistService", "$state", "$timeout", "$stateParams", "AudioService"];

    function detailsController($q, $scope, $ionicPopup, friendService, authService, toastService, playlistService, $state, $timeout, $stateParams, audioService) {

      $scope.$on("$ionicView.enter", function(e) {

        if (!angular.isDefined($stateParams.playlistId)) {
          toastService.show("Can not load playlist");
          return;
        };

        $scope.loaded = false;
        $scope.playlist = playlistService.get($stateParams.playlistId);
        if (!$scope.playlist || !$scope.playlist.friends) {
          toastService.show("Can not load playlist");
          return;
        }

        var counter = 0;

        getAudio();

        function getAudio(){

          ++counter;
          if (counter > 5) {
            toastService.show("Can not load playlist");
            $scope.loaded = true;
            return;
          }

          authService.run().then(function(){
            var promises = [];
            angular.forEach($scope.playlist.friends, function (value, key) {
              promises.push(audioService.get(value.uid));
            });
            return $q.all(promises);
          }).then(function(res) {            
            var result = [];
            var keepGoing = true;
            angular.forEach(res, function(value, key){
              if (keepGoing){
                if (!angular.isDefined(value.error) && angular.isArray(value.response)){
                  result = result.concat(value.response);
                }else if (value.error && value.error["error_code"] === 5){
                  // access_token was given to another ip address
                  keepGoing = false;
                }
              }
            });
            if (keepGoing){
              $scope.audios = result;
              $scope.loaded = true;
            }else{
              authService.clear();
              getAudio();
            }
          }).catch(function(err){
            getAudio();
          });
        }

      });

    }

})();
