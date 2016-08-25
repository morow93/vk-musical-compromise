(function() {

  "use strict";

  angular.module("filters.trackTime").filter("trackTime", trackTime);

  function trackTime() {
    return function(input) {
      if (input && !isNaN(input)){
        var minutes = Math.floor(input / 60);
        var seconds = parseInt(input) % 60;
        if (seconds < 10) seconds = "0" + seconds;
        if (minutes < 10) minutes = "0" + minutes;
        return minutes + ":" + seconds;
      }else {
        return null;
      }
    };
  }

})();
