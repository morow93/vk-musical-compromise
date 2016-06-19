(function() {

    "use strict";

    angular.module('starter.services', ["LocalStorageModule"]);

    friendService.$inject = ["$q", "$http", "localStorageService"];
    authService.$inject = ["$q", "$cordovaOauth", "localStorageService"];
    toastrService.$inject = ["$cordovaToast"];
    playlistService.$inject = ["localStorageService"];

    angular.module("starter.services").factory("FriendService", friendService);
    angular.module("starter.services").factory("AuthService", authService);
    angular.module("starter.services").factory("ToastrService", toastrService);
    angular.module("starter.services").factory("PlaylistService", playlistService);

    function friendService($q, $http, localStorageService) {

      var factory = {
        get: get
      };

      function get() {
        var deferred = $q.defer();
        var userInfo = localStorageService.get("authInfo");
        if (userInfo){
          $http.get('https://api.vk.com/method/friends.get?order=name&fields=photo_100,nickname&access_token=' + userInfo["access_token"]).then(function (res) {
            deferred.resolve(res.data);
          }).catch(function(err){
            deferred.reject(err);
          });
        }else{
          deferred.reject({ error: true });
        }
        return deferred.promise;
      }

      return factory;

    }

    function authService($q, $cordovaOauth, localStorageService) {

      var factory = {
        run: run,
        clear: clear
      };

      function run() {
        var deferred = $q.defer();
        var authInfo = localStorageService.get("authInfo");
        if (!authInfo || (authInfo && authInfo["expires_at"] < new Date())){
          $cordovaOauth.vkontakte("5509706", ["email", "user_id", "access_token"]).then(function(res) {
            res["expires_at"] = moment().add(res["expires_in"] - 10, 'seconds').toDate();
            localStorageService.set("authInfo", res);
            deferred.resolve(res);
          }, function(err) {
            localStorageService.remove("authInfo");
            deferred.reject(err);
          });
        }else{
          deferred.resolve({ error: false });
        }
        return deferred.promise;
      }

      function clear() {
        localStorageService.remove("authInfo");
      }

      return factory;

    }

    function toastrService($cordovaToast) {

      var factory = {
        show: show
      };

      function show(title) {
        try{
          $cordovaToast.showShortTop(title);
        }catch(err){
          alert(title);
        }
      }

      return factory;

    }

    function playlistService(localStorageService) {

      var factory = {
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

      return factory;

    }

})();
