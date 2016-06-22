(function() {

  "use strict";

  angular.module("core.services").factory("AuthService", authService);

  authService.$inject = ["$q", "$cordovaOauth", "localStorageService", "$http"];

    function authService($q, $cordovaOauth, localStorageService, $http) {

      var service = {
        run: run,
        clear: clear,
        getMe: getMe
      };

      function run() {
        var deferred = $q.defer();
        var authInfo = localStorageService.get("authInfo");
        if (!authInfo || (authInfo && authInfo["expires_at"] < new Date())){
          $cordovaOauth.vkontakte("5509706", ["audio"]).then(function(res) {
            res["expires_at"] = moment().add(res["expires_in"] - 10, 'seconds').toDate();
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
          $http.get('https://api.vk.com/method/users.get?fields=photo_100&access_token=' + userInfo["access_token"]).then(function (res) {
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
