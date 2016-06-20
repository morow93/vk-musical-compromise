(function() {

  "use strict";

  angular.module("app").factory("PlaylistService", playlistService);

  playlistService.$inject = ["localStorageService"];

  function playlistService(localStorageService) {

    var service = {
      create: create,
      get: get,
      remove: remove
    };

    function create(item) {
      if (item){
        item.playlistId = guid();
        var playlists = localStorageService.get("playlists");
        if (playlists){
          playlists.push(item);
        }else{
          playlists = [item];
        }
        localStorageService.set("playlists", playlists);
      }
    }

    function get() {
      var playlists = localStorageService.get("playlists");
      if (playlists){
        return playlists;
      }else{
        return [];
      }
    }

    function remove(item) {
      var playlists = localStorageService.get("playlists");
      if (playlists){
        angular.forEach(playlists, function(value, key) {
          if (value.playlistId === item.playlistId){
            playlists.splice(key, 1);
          }
        });
        localStorageService.set("playlists", playlists);
        return playlists;
      }else{
        return [];
      }
    }

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    return service;

  }

})();
