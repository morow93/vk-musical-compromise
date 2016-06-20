(function() {

  "use strict";

  angular.module("app").run(run);

  run.$inject = ["$ionicPlatform", "$cordovaOauth", "AuthService", "ToastService"];

  function run($ionicPlatform, $cordovaOauth, authService, toastService) {

    $ionicPlatform.ready(function() {

      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      authService.run().then(function(res){
        toastService.show("You are successfully logged in!");
      });

    });
  }

})();
