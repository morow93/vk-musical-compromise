(function() {

  "use strict";

  angular.module("core.services").factory("AuthService", authService);

  authService.$inject = ["$q", "$cordovaOauth", "localStorageService", "$http", "values", "ERRORS"];

    function authService($q, $cordovaOauth, localStorageService, $http, values, ERRORS) {

      var service = {
        run: run,
        clear: clear,
        getMe: getMe
      };

      function run() {
        var deferred = $q.defer();
        var authInfo = localStorageService.get("authInfo");

        if (!authInfo){
          if (window.cordova){
            $cordovaOauth.vkontakte("5509706", ["audio", "offline"]).then(function(res) {
              localStorageService.set("authInfo", res);
              deferred.resolve(res);
            }, function(err) {
              clear();
              deferred.reject(err);
            });
          }else{
            // cordovaOauth does not work on the PC so for debug you need manually put the access_token into localStorage
            authInfo = {
              access_token: "3617005547f04ba0b9d5654889987683d750a64791cd221dac6a7488db50f5a3e67b1c855b55e62e26d24"
            };
            localStorageService.set("authInfo", authInfo);
            deferred.resolve(authInfo);
          }
        }else{
          deferred.resolve(authInfo);
        }
        return deferred.promise;
      }

      function getMe() {
        var deferred = $q.defer();
        
        var userInfo = localStorageService.get("authInfo");
        if (userInfo){
          $http.get(values.baseVk +
            '/users.get?fields=photo_100&access_token='
            + userInfo["access_token"]).then(function (res) {
            deferred.resolve(res.data);
          }).catch(function(err){
            deferred.reject(err);
          });
        }else{
          deferred.reject(ERRORS.USER_INFO);
        }

        return deferred.promise;
      }

      function clear() {
        localStorageService.remove("authInfo");
      }

      return service;

    }

})();
