(function () {

  "use strict";

  angular.module("core.services").factory("AudioManager", AudioManager);

  AudioManager.$inject = ["ToastService", "PlaylistService", "BaseHttpService",
    "AudioService", "$stateParams", "$q"];

  function AudioManager (toastService, playlistService, baseHttpService, audioService, $stateParams, $q) {

    var service = {
      toggleTrack: toggleTrack,
      activate: activate,
      resetAudio: resetAudio,
      getCurrentTrack: getCurrentTrack,
      getTracks: getTracks,
      isLoaded: isLoaded,
      getCurrentPlaylist: getCurrentPlaylist
    };

    function getTracks() {
      return service.tracks;
    }

    function getCurrentTrack() {
      return service.currentTrack;
    }

    function isLoaded() {
      return service.loaded;
    }

    function getCurrentPlaylist() {
      return service.playlist;
    }

    function toggleTrack(track, index) {
      track = track || service.currentTrack;
      service.currentTrack.index = service.currentTrack.index || index;

      if (service.currentTrack.index !== index){
        // Disable previous track
        service.currentTrack.playing = false;
        service.currentTrack.audio.pause();
      }

      track.playing = !track.playing;
      var previousTrack = angular.copy(service.currentTrack);
      service.currentTrack = track;
      service.currentTrack.index = index;

      if (service.currentTrack.index === previousTrack.index){
        if(!service.currentTrack.audio){
          service.currentTrack.audio = new Audio(track.url);
          service.currentTrack.audio.addEventListener("ended", continueToPlay);
          service.currentTrack.audio.addEventListener("error", continueToPlay);
        }
        if (track.playing){
          service.currentTrack.audio.play();
        }else{
          service.currentTrack.audio.pause();
        }
      }else{
        if (service.currentTrack.audio){
          service.currentTrack.audio.pause();
        }
        if (track.playing){
          service.currentTrack.audio = new Audio(track.url);
          service.currentTrack.audio.addEventListener("ended", continueToPlay);
          service.currentTrack.audio.addEventListener("error", continueToPlay);
          service.currentTrack.audio.play();
        }else{
          service.currentTrack.audio.pause();
        }
      }

      function continueToPlay() {
        service.scope.$apply(function() {
          service.currentTrack.playing = false;
          service.currentTrack.audio.pause();
          var nextTrackIndex = service.currentTrack.index + 1;

          if (service.tracks[nextTrackIndex]) {
            service.currentTrack = service.tracks[nextTrackIndex];
            service.currentTrack.playing = true;
            service.currentTrack.index = nextTrackIndex;

            service.currentTrack.audio = new Audio(service.tracks[nextTrackIndex].url);
            service.currentTrack.audio.addEventListener("ended", continueToPlay);
            service.currentTrack.audio.addEventListener("error", continueToPlay);
            service.currentTrack.audio.play();
          }
        });
      }

    }

    function resetAudio() {
      if (service.currentTrack && service.currentTrack.audio){
        service.currentTrack.audio.pause();
      }
      // "Pointer" to current playing track
      service.currentTrack = {};
      service.currentTrack.playing = false;
      // Will be audio object
      service.currentTrack.audio = null;
      service.loaded = false;
    }

    function activate(scope) {
      service.scope = scope;

      var deferred = $q.defer();

      resetAudio();

      service.tracks = null;
      service.loaded = true;
      service.playlist = null;

      if (!angular.isDefined($stateParams.playlistId)) {
        toastService.show("Can not load service.playlist");
        service.scope.$broadcast('scroll.refreshComplete');
        deferred.reject({
          tracks: service.tracks,
          loaded: service.loaded,
          playlist: service.playlist
        });
        return deferred.promise;
      }

      service.playlist = playlistService.get($stateParams.playlistId);
      if (!service.playlist || !service.playlist.friends) {
        toastService.show("Can not load service.playlist");
        service.scope.$broadcast('scroll.refreshComplete');
        deferred.reject({
          tracks: service.tracks,
          loaded: service.loaded,
          playlist: service.playlist
        });
        return deferred.promise;
      }

      baseHttpService.run(function() {
        return service.playlist.friends.map(function(item) {
          return audioService.get(item.uid);
        });
      }).then(function(res) {
        service.tracks = audioService.mix(res);
        deferred.resolve({
          tracks: service.tracks,
          loaded: service.loaded,
          playlist: service.playlist
        });
      }).catch(function(err) {
        service.tracks = null;
        deferred.reject({
          tracks: service.tracks,
          loaded: service.loaded,
          playlist: service.playlist
        });
        toastService.show("Can not load service.playlist");
      }).finally(function () {
        service.scope.$broadcast('scroll.refreshComplete');
      });

      return deferred.promise;
    }

    return service;

  }

})();
