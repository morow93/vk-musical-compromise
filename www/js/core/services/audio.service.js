(function() {

  "use strict";

  angular.module("core.services").factory("AudioService", audioService);

  audioService.$inject = ["$q", "$http", "localStorageService"];

  function audioService($q, $http, localStorageService) {

    var service = {
      get: get,
      mix: mix
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

    function mix(lists) {
      var result = [];
      if (angular.isArray(lists) && lists.length > 0){
        // Get max length
        var maxLength = 0;
        for (var i = 0; i < lists.length; i++) {
          if (lists[i].length > maxLength){
            maxLength = lists[i].length;
          }
        }
        // Get separate index for each list
        var indexes = [];
        for (var i = 0; i < lists.length; i++) {
          indexes.push(0);
        }
        // Mix
        var k = 0;
        while (k < maxLength) {
          for (var i = 0; i < lists.length; i++) {
            var currentList = lists[i];
            if (!currentList[indexes[i]]){
              indexes[i] = 0;
            }
            result.push(currentList[indexes[i]]);
          }
          for (var j = 0; j < indexes.length; j++) {
            ++indexes[j];
          }
          ++k;
        }
      }
      return result;
    }

    return service;

  }

})();
