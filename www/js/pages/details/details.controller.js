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

        var promises = [];
        angular.forEach($scope.playlist.friends, function (value, key) {
          promises.push(audioService.get(value.uid));
        });

        getAudio();

        function getAudio(){

          authService.run().then(function(){
            return $q.all(promises);
          }).then(function(res) {
            var result = [];
            angular.forEach(res, function(value, key){
              if (!angular.isDefined(value.error) && angular.isArray(value.response)){
                result = result.concat(value.response);
              }else{
                alert("THEN " + JSON.stringify(value));
              }
            });
            $scope.audios = result;
          }).catch(function(err){
            alert("CATCH " + JSON.stringify(err));
          }).finally(function () {
            $scope.loaded = true;
          });
        }

      });

    }

})();
