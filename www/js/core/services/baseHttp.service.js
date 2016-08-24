(function() {

  "use strict";

  angular.module("core.services").factory("BaseHttpService", baseHttpService);

  baseHttpService.$inject = ["$injector"];

  function baseHttpService($injector) {

    var $q;
    var authService;

    var service = {
      run: run
    };

    function run(functions) {

      $q = $q || $injector.get("$q");
      authService = authService || $injector.get("AuthService");

      var deferred = $q.defer();
      var counter = 0;

      runInner();

      function runInner(){

        ++counter;
        if (counter > 5) {
          deferred.reject({ error: true });
        }else{
          var promises = functions();

          authService.run().then(function(){
            return $q.all(promises);
          }).then(function(res) {
            var result = [];
            var keepGoing = true;
            angular.forEach(res, function(value, key){
              if (keepGoing){
                if (!angular.isDefined(value.error) && angular.isArray(value.response)){
                  result.push(value.response);
                }else if (value.error/*&& value.error["error_code"] === 5*/){
                  // access_token was given to another ip address
                  keepGoing = false;
                }
              }
            });
            if (keepGoing){
              deferred.resolve(result);
            }else{
              authService.clear();
              runInner();
            }
          }).catch(function(err){
            runInner();
          });
        }

      }

      return deferred.promise;

    }

    return service;

  }

})();
