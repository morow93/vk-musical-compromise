(function() {

    "use strict";

    angular.module("app.pages").controller("PagesController", pagesController);

    pagesController.$inject = ["$scope", "ToastService"];

    function pagesController($scope, toastService) {

      $scope.$on("$ionicView.enter", function(e) {
        // TODO something
      });
    }


})();
