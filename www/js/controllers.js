(function() {

    "use strict";

    angular.module("starter.controllers", []);

    friendsCtrl.$inject = ["$scope", "FriendService"];
    dashCtrl.$inject = [];

    angular.module("starter.controllers").controller("FriendsCtrl", friendsCtrl);
    angular.module("starter.controllers").controller("DashCtrl", dashCtrl);

    function friendsCtrl($scope, friendService) {

      $scope.$on("$ionicView.enter", function(e) {

        $scope.loaded = false;
        friendService.get().then(function(res){
          $scope.friends = res.response;
        }).catch(function(error){
          alert(JSON.stringify(error));
        }).finally(function(){
          $scope.loaded = true;
        });

      });

    }

    function dashCtrl() {

    }

})();
