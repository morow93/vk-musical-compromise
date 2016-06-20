(function() {

  "use strict";

  angular.module("app").factory("ToastService", toastService);

  toastService.$inject = ["$cordovaToast"];

  function toastService($cordovaToast) {

    var service = {
      show: show
    };

    function show(title) {
      try{
        $cordovaToast.showShortTop(title);
      }catch(err){
        alert(title);
      }
    }

    return service;

  }

})();
