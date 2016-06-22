(function() {

    "use strict";

    angular.module("pages.new").controller("NewController", newController);

    newController.$inject = ["$rootScope", "$scope", "$ionicPopup", "FriendService", "AuthService", "ToastService", "PlaylistService", "$state", "$timeout", "$q"];

    function newController($rootScope, $scope, $ionicPopup, friendService, authService, toastService, playlistService, $state, $timeout, $q) {

      $scope.closeCard = closeCard;
      $scope.checkFriend = checkFriend;
      $scope.create = create;
      $scope.uncheck = uncheck;
      $scope.activate = activate;

      $scope.$on("$ionicView.enter", function(e) {
        activate();
      });

      function activate() {

        $scope.loaded = false;
        $scope.selectedFriendsCounter = 0;
        $scope.selectedFriendsTitle = "";

        var counter = 0;

        getFriends();

        function getFriends(){

          ++counter;
          if (counter > 5) {
            toastService.show("Can not load friends");
            $scope.loaded = true;
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            return;
          }

          authService.run().then(function(){
            return $q.all([authService.getMe(), friendService.get()]);
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
              $scope.friends = result;
              $scope.loaded = true;
              // Stop the ion-refresher from spinning
              $scope.$broadcast('scroll.refreshComplete');
            }else{
              authService.clear();
              getFriends();
            }
          }).catch(function(err){
            getFriends();
          });
        }

      }

      function closeCard(){
        // Show for the first time
        $rootScope.showNewPlaylistCard = false;

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
            $scope.selectedFriendsTitle = "1 friend";
          }else{
            $scope.selectedFriendsTitle = $scope.selectedFriendsCounter + " friends";
          }
        }

      }

      function uncheck() {
        angular.forEach($scope.friends, function(value, key) {
          value.isChecked = false;
        });
        $scope.selectedFriendsCounter = 0;
        $scope.selectedFriendsTitle = "";
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
                  // Don't allow the user to close unless he enters name
                  e.preventDefault();
                } else {
                  return $scope.data.playlistName;
                }
              }
            }
          ]
        });

        confirmPopup.then(function(res) {
          if (res){
            playlistService.create({
              title: res,
              friends: selectedFriends,
              createdAt: new Date()
            });
            $state.go("tab.list");
          }
        });

      }

    }

})();
