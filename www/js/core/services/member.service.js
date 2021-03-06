(function() {

  "use strict";

  angular.module("core.services").factory("MemberService", memberService);

  memberService.$inject = ["$q", "$http", "localStorageService", "values", "ERRORS"];

  function memberService($q, $http, localStorageService, values, ERRORS) {

    var service = {
      get: get
    };

    function get() {
      var deferred = $q.defer();
      
      var userInfo = localStorageService.get("authInfo");
      if (userInfo){
        $http.get(values.baseVk +
          '/friends.get?order=name&fields=photo_100,nickname&access_token='
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

    return service;

  }

})();
