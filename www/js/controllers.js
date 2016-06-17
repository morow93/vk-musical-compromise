(function() {

    "use strict";

    angular.module("starter.controllers", []);

    friendsCtrl.$inject = ["$scope", "FriendService", "AuthService"];
    dashCtrl.$inject = [];

    angular.module("starter.controllers").controller("FriendsCtrl", friendsCtrl);
    angular.module("starter.controllers").controller("DashCtrl", dashCtrl);

    function friendsCtrl($scope, friendService, authService) {

      $scope.$on("$ionicView.enter", function(e) {

        var counter = 1;

        getFriends();

        function getFriends(){

          ++counter;
          if (counter > 5) {
            alert("MORE THAN 5 TIMES");
            return;
          }

          authService.run().then(function(){
            $scope.loaded = false;
            friendService.get().then(function(res){
              alert("OK " + JSON.stringify(res));
              $scope.friends = res.response;
            }).catch(function(err){
              authService.clear();
              getFriends();
              alert("ERROR " + JSON.stringify(err));
            }).finally(function(){
              $scope.loaded = true;
            });
          }).catch(function(err){
            alert("ERROR " + JSON.stringify(err));
            authService.clear();
            getFriends();
          });

        }

      });

    }

    function dashCtrl() {

    }

})();
