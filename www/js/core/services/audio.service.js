(function() {

  "use strict";

  angular.module("core.services").factory("AudioService", audioService);

  audioService.$inject = ["$q", "$http", "localStorageService", "values", "ERRORS"];

  function audioService($q, $http, localStorageService, values, ERRORS) {

    var service = {
      get: get,
      mix: mix
    };

    function get(user) {

      var deferred = $q.defer();
      var userInfo = localStorageService.get("authInfo");
      if (userInfo){
        $http.get(values.baseVk + '/audio.get?owner_id=' + user.uid + '&access_token=' + userInfo["access_token"]).then(function (res) {
          if (res.data && angular.isArray(res.data.response)){
            res.data.response.shift();
            angular.forEach(res.data.response, function(item) {
              item['photo_100'] = user['photo_100']
            });
            res.data.response['owner_id'] = user.uid;
          }
          deferred.resolve(res.data);
        }).catch(function(err){
          deferred.reject(err);
        });
      }else{
        deferred.reject(ERRORS.USER_INFO);
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
            result.push(angular.copy(currentList[indexes[i]]));
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
