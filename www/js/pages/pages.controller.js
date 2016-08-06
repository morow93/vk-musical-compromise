(function() {

    "use strict";

    angular.module("app.pages").controller("PagesController", pagesController);

    pagesController.$inject = ["$scope", "ToastService"];

    function pagesController($scope, toastService) {

      $scope.onPlaylistTabDeselected = onPlaylistTabDeselected;

      function onPlaylistTabDeselected() {
        $scope.$broadcast("playlistTabDeselected");
      }

    }

})();
