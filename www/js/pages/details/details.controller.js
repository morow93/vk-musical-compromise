(function() {

    "use strict";

    angular.module("pages.details").controller("DetailsController", detailsController);

    detailsController.$inject = ["$q", "$scope", "$ionicPopup", "MemberService", "AuthService", "ToastService", "PlaylistService",
      "$state", "$timeout", "$stateParams", "AudioService", "BaseHttpService", "$ionicPopover", "AudioManager"];

    function detailsController($q, $scope, $ionicPopup, memberService, authService, toastService, playlistService,
      $state, $timeout, $stateParams, audioService, baseHttpService, $ionicPopover, audioManager) {
      
      $scope.openPopoverMembers = audioManager.openPopoverMembers;
      $scope.toggleTrack = audioManager.toggleTrack;

      $scope.$on("$ionicView.enter", function() {
        audioManager.activate($scope);
      });
      $scope.$on("$stateChangeStart", function() {
        audioManager.resetState();
      });
      $scope.$on("playlistTabDeselected", function() {
        audioManager.resetState();
      });

    }

})();
