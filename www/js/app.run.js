(function() {

  "use strict";

  angular.module("app").run(run);

  run.$inject = ["$rootScope", "$ionicPlatform", "$cordovaOauth", "AuthService", "ToastService", "localStorageService"];

  function run($rootScope, $ionicPlatform, $cordovaOauth, authService, toastService, localStorageService) {

    $ionicPlatform.ready(function() {

      if (!ionic.Platform.isIOS() && !ionic.Platform.isIPad() && !ionic.Platform.isAndroid() && !ionic.Platform.isWindowsPhone()) {
        var authInfo = {};
        authInfo["expires_in"] = 86400;
        authInfo["expires_at"] = moment().add(authInfo["expires_in"] - 10, 'seconds').toDate();
        authInfo["access_token"] = "726dacfff3ec43c0f3398ca3c4064233754529c360a868e7107a49c27dccf7ab710cc17891b10f0c75fb4";
        localStorageService.set("authInfo", authInfo);
      }

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
