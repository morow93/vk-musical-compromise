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

      function runInner(error){
        ++counter;
        if (counter > 5) {
          deferred.reject(error);
        }else{
          var promises = functions();
          authService.run().then(function(){
            return $q.all(promises);
          }).then(function(res) {
            var result = [];
            var errors = [];
            var keepGoing = true;
            angular.forEach(res, function(value, key){
              if (keepGoing){
                if (!angular.isDefined(value.error)){
                  result.push(value.response);
                }else{
                  // need resolve errors when they are not critical
                  errors.push(value.error);
                  if (value.error["error_code"] === 5){
                    // some trouble with authenitcation
                    keepGoing = false;
                  }
                }
              }
            });
            if (keepGoing){
              deferred.resolve(result);
            }else{
              authService.clear();
              runInner(errors);
            }
          }).catch(function(err){
            runInner(err);
          });
        }

      }

      return deferred.promise;

    }

    return service;

  }

})();
