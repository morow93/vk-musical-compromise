(function() {

  "use strict";

  angular.module("core.services").factory("ToastService", toastService);

  toastService.$inject = ["$cordovaToast"];

  function toastService($cordovaToast) {

    var service = {
      show: show,
      showLong: showLong
    };

    function show(title) {
      try{
        $cordovaToast.showShortTop(title);
      }catch(err){
        alert(title);
      }
    }

    function showLong(title) {
      try{
        $cordovaToast.showLongTop(title);
      }catch(err){
        alert(title);
      }
    }

    return service;

  }

})();
