(function() {

    "use strict";

    angular.module("starter.controllers", []);

    newCtrl.$inject = ["$scope", "FriendService", "AuthService", "ToastrService"];
    dashCtrl.$inject = [];

    angular.module("starter.controllers").controller("NewCtrl", newCtrl);
    angular.module("starter.controllers").controller("DashCtrl", dashCtrl);

    function newCtrl($scope, friendService, authService, toastrService) {

      $scope.closeCard = closeCard;

      $scope.$on("$ionicView.enter", function(e) {

        var counter = 0;

        getFriends();

        function getFriends(){
          ++counter;
          if (counter > 5) {
            toastrService.show("ERROR GET FRIENDS FOR NEW PLAYLIST");
            return;
          }
          authService.run().then(function(){
            $scope.loaded = false;
            friendService.get().then(function(res){
              if (res.error) {
                authService.clear();
                getFriends();
              }else{
                $scope.friends = res.response;
              }
            }).catch(function(err){
              authService.clear();
              getFriends();
            }).finally(function(){
              $scope.loaded = true;
            });
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


    }

    function dashCtrl() {

    }

})();
