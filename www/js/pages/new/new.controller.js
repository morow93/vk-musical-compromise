(function() {

    "use strict";

    angular.module("pages.new").controller("NewController", newController);

    newController.$inject = ["$rootScope", "$scope", "$ionicPopup", "MemberService", "AuthService", "ToastService",
      "PlaylistService", "$state", "BaseHttpService"];

    function newController($rootScope, $scope, $ionicPopup, memberService, authService, toastService,
      playlistService, $state, baseHttpService) {

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

        $scope.forms = {
            popupForm: {}
        };

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

        $scope.popupData = getPopupData();

        var confirmPopup = $ionicPopup.show({
          title: 'New Playlist',
          template:
            '<form name="forms.popupForm">' +
              '<input type="text" name="playlistTitle" ng-model="popupData.playlistTitle" placeholder="Choose playlist name" />' +
            '</form>',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Create</b>',
              scope: $scope,
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.popupData.playlistTitle) {
                  // Don't allow the user to close unless he enters name
                  e.preventDefault();
                } else {
                  if ($scope.forms.popupForm.$pristine){
                    $scope.popupData.playlistDefaultName = true;
                  }
                  $scope.forms.popupForm.$setPristine();
                  return $scope.popupData;
                }
              }
            }
          ]
        });

        confirmPopup.then(function(res) {
          if (res){
            playlistService.create({
              title: res.playlistTitle,
              defaultName: res.playlistDefaultName,
              number: res.playlistNumber,
              members: selectedMembers,
              createdAt: new Date()
            });
            $state.go("tab.list");
          }
        });

        function getPopupData() {

          var number = null;
          var keepGoing = true;
          var numbers = playlistService.get().filter(function(it) { return it.defaultName; }).map(function(it){ return it.number; }).sort();

          angular.forEach(numbers, function(it, index) {
            if (keepGoing){
              if (it && it != (index + 1)){
                keepGoing = false;
                number = index + 1;
              }
            }
          });

          if (!number){
            number = numbers.length + 1;
          }

          return {
            playlistTitle: 'Playlist #' + number,
            playlistNumber: number
          };

        }
      }

    }

})();
