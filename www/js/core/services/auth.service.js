(function() {

  "use strict";

  angular.module("core.services").factory("AuthService", authService);

  authService.$inject = ["$q", "$cordovaOauth", "localStorageService", "$http", "values"];

    function authService($q, $cordovaOauth, localStorageService, $http, values) {

      var service = {
        run: run,
        clear: clear,
        getMe: getMe
      };

      function run() {
        var deferred = $q.defer();
        var authInfo = localStorageService.get("authInfo");

        if (!authInfo){
          $cordovaOauth.vkontakte("5509706", ["audio", "offline"]).then(function(res) {
            localStorageService.set("authInfo", res);
            deferred.resolve(res);
          }, function(err) {
            localStorageService.remove("authInfo");
            deferred.reject(err);
          });
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
          deferred.reject({ error: true });
        }
        return deferred.promise;
      }

      function clear() {
        localStorageService.remove("authInfo");
      }

      return service;

    }

})();
