(function() {

  "use strict";

  angular.module("app").run(run);

  run.$inject = ["$rootScope", "$ionicPlatform", "$cordovaOauth", "AuthService", "ToastService"];

  function run($rootScope, $ionicPlatform, $cordovaOauth, authService, toastService) {

    $ionicPlatform.ready(function() {

      $rootScope.showNewPlaylistCard = true;

      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      authService.run();

    });
  }

})();
