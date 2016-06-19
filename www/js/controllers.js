(function() {

    "use strict";

    angular.module("starter.controllers", []);

    newCtrl.$inject = ["$scope", "$ionicPopup", "FriendService", "AuthService", "ToastrService", "PlaylistService", "$state", "$timeout"];
    dashCtrl.$inject = ["$scope", "PlaylistService"];

    angular.module("starter.controllers").controller("NewCtrl", newCtrl);
    angular.module("starter.controllers").controller("DashCtrl", dashCtrl);

    function newCtrl($scope, $ionicPopup, friendService, authService, toastrService, playlistService, $state, $timeout) {

      $scope.closeCard = closeCard;
      $scope.checkFriend = checkFriend;
      $scope.create = create;
      
      $scope.$on("$ionicView.enter", function(e) {

        $scope.loaded = false;

        var counter = 0;

        getFriends();

        function getFriends(){

          ++counter;
          if (counter > 5) {
            toastrService.show("ERROR GET FRIENDS FOR NEW PLAYLIST");
            return;
          }

          authService.run().then(function(){
            return friendService.get();
          }).then(function(res) {
            if (res.error) {
              authService.clear();
              getFriends();
            }else{
              $scope.friends = res.response;
            }
          }).catch(function(err){
            authService.clear();
            getFriends();
          }).finally(function () {
            $scope.loaded = true;
          });
        }

      });

      function closeCard(){
        var myEl = angular.element(document.querySelector("#new-playlist-card"));
        myEl.remove();
      }

      function checkFriend() {

        // Close keyboard
        document.activeElement.blur();

        var counter = 0;
        angular.forEach($scope.friends, function(value, key) {
          if (value.isChecked){
            counter++;
          }
        });
        $scope.selectedFriendsCounter = counter;

        if ($scope.selectedFriendsCounter > 0){
          if ($scope.selectedFriendsCounter === 1){
            $scope.selectedFriendsTitle = "You checked 1 friend";
          }else{
            $scope.selectedFriendsTitle = "You checked " + $scope.selectedFriendsCounter + " friends";
          }
        }

      }

      function create() {

        var selectedFriends = [];
        angular.forEach($scope.friends, function(value, key) {
          if (value.isChecked){
            selectedFriends.push(value);
          }
        });

        $scope.data = {};

        var confirmPopup = $ionicPopup.show({
          title: 'New Playlist',
          template: '<input type="text" ng-model="data.playlistName" placeholder="Choose playlist name">',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Create</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.data.playlistName) {
                  //don't allow the user to close unless he enters name
                  e.preventDefault();
                } else {
                  return $scope.data.playlistName;
                }
              }
            }
          ]
        });

        confirmPopup.then(function(res) {
          playlistService.create({
            title: res,
            friends: selectedFriends
          });
          $state.go("tab.dash");
        });

      }

    }

    function dashCtrl($scope, playlistService) {

      $scope.$on("$ionicView.enter", function(e) {
        var playlists = playlistService.get();
        alert(JSON.stringify(playlists));
      });

    }

})();
