(function() {

  "use strict";

  angular.module("core.services").factory("ToastService", toastService);

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
