(function() {

  "use strict";

  angular.module("core.services").factory("AudioService", audioService);

  audioService.$inject = ["$q", "$http", "localStorageService"];

  function audioService($q, $http, localStorageService) {

    var service = {
      get: get
    };

    function get(uid) {
      var deferred = $q.defer();
      var userInfo = localStorageService.get("authInfo");
      if (userInfo){
        $http.get('https://api.vk.com/method/audio.get?owner_id=' + uid + '&access_token=' + userInfo["access_token"]).then(function (res) {
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
