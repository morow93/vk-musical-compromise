(function() {

    "use strict";

    angular.module("starter.controllers", []);

    friendsCtrl.$inject = ["$scope", "FriendService", "AuthService", "ToastrService"];
    dashCtrl.$inject = [];

    angular.module("starter.controllers").controller("FriendsCtrl", friendsCtrl);
    angular.module("starter.controllers").controller("DashCtrl", dashCtrl);

    function friendsCtrl($scope, friendService, authService, toastrService) {

      $scope.$on("$ionicView.enter", function(e) {

        var counter = 0;

        getFriends();

        function getFriends(){
          ++counter;
          if (counter > 5) {
            toastrService.show("GET FRIENDS: ERROR MORE THAN 5 TIMES");
            return;
          }
          authService.run().then(function(){
            $scope.loaded = false;
            friendService.get().then(function(res){
              if (res.error) {
                toastrService.show(JSON.Stringify(res));
                authService.clear();
                getFriends();
              }else{
                $scope.friends = res.response;
              }
            }).catch(function(err){
              toastrService.show(JSON.Stringify(err));
              authService.clear();
              getFriends();
            }).finally(function(){
              $scope.loaded = true;
            });
          }).catch(function(err){
            toastrService.show(JSON.Stringify(err));
            authService.clear();
            getFriends();
          });
        }
        
      });

    }

    function dashCtrl() {

    }

})();
