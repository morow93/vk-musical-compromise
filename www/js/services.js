(function() {

    "use strict";

    angular.module('starter.services', ['LocalStorageModule']);

    friendService.$inject = ["$q", "$http", "localStorageService"];

    angular.module("starter.services").factory("FriendService", friendService);

    function friendService($q, $http, localStorageService) {

      var factory = {
        get: get
      };

      function get() {
        var deferred = $q.defer();
        var userInfo = localStorageService.get("authInfo");
        if (userInfo){
          $http.get('https://api.vk.com/method/friends.get?order=name&fields=photo_100,nickname&access_token=' + userInfo["access_token"]).then(function (res) {
            deferred.resolve(res.data);
          }).catch(function(err){
            deferred.reject(err);
          });
        }else{
          deferred.reject({ error: "empty_auth_info"});
        }
        return deferred.promise;
      }

      return factory;

    }

})();
