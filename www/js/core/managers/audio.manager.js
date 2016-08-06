(function () {

  "use strict";

  angular.module("core.services").factory("AudioManager", AudioManager);

  AudioManager.$inject = ["ToastService", "PlaylistService", "BaseHttpService",
    "AudioService", "$stateParams", "$q"];

  function AudioManager (toastService, playlistService, baseHttpService, audioService, $stateParams, $q) {

    //TODO refactor this govnokod

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

    function getCurrentPlaylist() {
      return service.playlist;
    }

    function isLoaded() {
      return service.loaded;
    }

    function toggleTrack(track, index) {

      track = angular.extend(track, { index: index });
      //track = track || service.currentTrack;
      //service.currentTrack.index =  angular.isDefined(index) ? index : service.currentTrack.index;

      if (angular.isDefined(service.currentTrack.index) && service.currentTrack.index !== index){
        // Disable previous track
        service.currentTrack.playing = false;
        if (service.currentTrack.audio){
            service.currentTrack.audio.pause();
        }
      }

      track.playing = !track.playing;
      var previousTrack = angular.copy(service.currentTrack);
      service.currentTrack = track;

      if (service.currentTrack.index === previousTrack.index){
        if(!service.currentTrack.audio){
          service.currentTrack.audio = new Audio(service.currentTrack.url);
          service.currentTrack.audio.addEventListener("ended", continueToPlay);
          service.currentTrack.audio.addEventListener("error", continueToPlay);
        }
        if (service.currentTrack.playing){
          service.currentTrack.audio.play();
        }else{
          service.currentTrack.audio.pause();
        }
      }else{
        if (service.currentTrack.audio){
          service.currentTrack.audio.pause();
        }
        if (service.currentTrack.playing){
          service.currentTrack.audio = new Audio(service.currentTrack.url);
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

      if (service.currentTrack){
        service.currentTrack.playing = false;
        if (service.currentTrack.audio){
          service.currentTrack.audio.pause();
        }
      }else{
        service.currentTrack = {};
      }
      service.loaded = false;
    }

    function activate(scope) {

      service.scope = scope;

      var deferred = $q.defer();

      resetAudio();

      service.tracks = null;
      service.playlist = null;
      service.loaded = true;

      if (!angular.isDefined($stateParams.playlistId)) {
        toastService.show("Can not load playlist");
        service.scope.$broadcast('scroll.refreshComplete');
        deferred.reject({ error: true });
        return deferred.promise;
      }

      service.playlist = playlistService.get($stateParams.playlistId);
      if (!service.playlist || !service.playlist.members) {
        toastService.show("Can not load playlist");
        service.scope.$broadcast('scroll.refreshComplete');
        deferred.reject({ error: true });
        return deferred.promise;
      }

      baseHttpService.run(function() {
        return service.playlist.members.map(function(item) {
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
        deferred.reject({ error: true });
        toastService.show("Can not load playlist");
      }).finally(function () {
        service.scope.$broadcast('scroll.refreshComplete');
      });

      return deferred.promise;
    }

    return service;

  }

})();
