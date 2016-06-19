(function() {

    "use strict";

    angular.module("starter.controllers", []);

    newCtrl.$inject = ["$scope", "FriendService", "AuthService", "ToastrService"];
    dashCtrl.$inject = [];

    angular.module("starter.controllers").controller("NewCtrl", newCtrl);
    angular.module("starter.controllers").controller("DashCtrl", dashCtrl);

    function newCtrl($scope, friendService, authService, toastrService) {

      $scope.closeCard = closeCard;
      $scope.checkFriend = checkFriend;

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

    }

    function dashCtrl() {

    }

})();
