(function() {

  "use strict";

  angular.module("core.services").factory("FriendService", friendService);

  friendService.$inject = ["$q", "$http", "localStorageService"];

  function friendService($q, $http, localStorageService) {

    var service = {
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
        deferred.reject({ error: true });
      }
      return deferred.promise;
    }

    return service;

  }

})();
