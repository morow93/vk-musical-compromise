(function() {

    "use strict";

    angular.module("pages.new").controller("NewController", newController);

    newController.$inject = ["$rootScope", "$scope", "$ionicPopup", "MemberService", "AuthService", "ToastService", "PlaylistService", "$state", "$timeout", "$q", "BaseHttpService"];

    function newController($rootScope, $scope, $ionicPopup, memberService, authService, toastService, playlistService, $state, $timeout, $q, baseHttpService) {

      $scope.closeCard = closeCard;
      $scope.checkMember = checkMember;
      $scope.create = create;
      $scope.uncheck = uncheck;
      $scope.activate = activate;

      $scope.$on("$ionicView.enter", function(e) {
        activate();
      });

      function activate() {

        $scope.loaded = false;
        $scope.selectedMembersCounter = 0;
        $scope.selectedMembersTitle = "";

        baseHttpService.run(function() {
          return [
            authService.getMe(),
            memberService.get()
          ];
        }).then(function(res) {
          var result = [];
          angular.forEach(res, function(value, key) {
            result = result.concat(value);
          });
          $scope.members = result;
        }).catch(function(err) {
          toastService.show("Can not load people");
          $scope.members = null;
        }).finally(function() {
          $scope.loaded = true;
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });

      }

      function closeCard(){
        // Show for the first time
        $rootScope.showNewPlaylistCard = false;

        var myEl = angular.element(document.querySelector("#new-playlist-card"));
        myEl.remove();
      }

      function checkMember() {
        // Close keyboard
        document.activeElement.blur();

        var counter = 0;
        angular.forEach($scope.members, function(value, key) {
          if (value.isChecked){
            counter++;
          }
        });

        $scope.selectedMembersCounter = counter;

        if ($scope.selectedMembersCounter > 0){
          if ($scope.selectedMembersCounter === 1){
            $scope.selectedMembersTitle = "1 member";
          }else{
            $scope.selectedMembersTitle = $scope.selectedMembersCounter + " members";
          }
        }

      }

      function uncheck() {
        angular.forEach($scope.members, function(value, key) {
          value.isChecked = false;
        });
        $scope.selectedMembersCounter = 0;
        $scope.selectedMembersTitle = "";
      }

      function create() {

        var selectedMembers = [];
        angular.forEach($scope.members, function(value, key) {
          if (value.isChecked){
            selectedMembers.push(value);
          }
        });

        $scope.playlistName = 'Playlist #' + (playlistService.get().length + 1);

        var confirmPopup = $ionicPopup.show({
          title: 'New Playlist',
          template: '<input type="text" ng-model="playlistName" placeholder="Choose playlist name">',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Create</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.playlistName) {
                  // Don't allow the user to close unless he enters name
                  e.preventDefault();
                } else {
                  return $scope.playlistName;
                }
              }
            }
          ]
        });

        confirmPopup.then(function(res) {
          if (res){
            playlistService.create({
              title: res,
              members: selectedMembers,
              createdAt: new Date()
            });
            $state.go("tab.list");
          }
        });

      }

    }

})();
