(function () {

  "use strict";

  angular.module("core.managers").factory("AudioManager", audioManager);

  audioManager.$inject = ["$rootScope", "ToastService", "PlaylistService", "BaseHttpService",
    "AudioService", "$stateParams", "$ionicPopover"];

  function audioManager ($rootScope, toastService, playlistService, baseHttpService,
    audioService, $stateParams, $ionicPopover) {

    var manager = this;

    manager.activate = activate;
    manager.resetState = resetState;
    manager.toggleTrack = toggleTrack;
    manager.openPopoverMembers = openPopoverMembers;

    function activate(params) {

      if (params && angular.isObject(params)){
        manager.scope = params;
      }

      // Needed for view
      manager.scope.pointer = $rootScope.pointer = {};

      resetState();
      manager.scope.loaded = false;
      manager.scope.refreshing = params === true;

      if (!angular.isDefined($stateParams.playlistId)) {
        manager.scope.tracks = null;
        manager.scope.loaded = true;
        toastService.show("Can not load playlist");
        // Stop the ionrefresher from spinning
        manager.scope.$broadcast('scroll.refreshComplete');
        return;
      }

      manager.scope.playlist = playlistService.get($stateParams.playlistId);
      if (!manager.scope.playlist || !manager.scope.playlist.members) {
        manager.scope.tracks = null;
        manager.scope.loaded = true;
        toastService.show("Can not load playlist");
        // Stop the ionrefresher from spinning
        manager.scope.$broadcast('scroll.refreshComplete');
        return;
      }

      baseHttpService.run(function() {
        return manager.scope.playlist.members.map(function(item) {
          return audioService.get(item);
        });
      }).then(function(res) {
        manager.scope.tracks = audioService.mix(res);
        checkNotLoadedUsers(res);
      }).catch(function(err) {
        manager.scope.tracks = null;
        toastService.show("Can not load playlist");
      }).finally(function() {
        manager.scope.loaded = true;
        // Stop the ionrefresher from spinning
        manager.scope.$broadcast('scroll.refreshComplete');
      });

      $ionicPopover.fromTemplateUrl('popoverMembers.html', {
        scope: manager.scope
      }).then(function(popoverMembers) {
        manager.scope.popoverMembers = popoverMembers;
      });

      function checkNotLoadedUsers(tracks) {
        var loadedUsers = tracks.map(function(it) {
            return it['owner_id'];
        });
        var notLoadedUsers = manager.scope.playlist.members.filter(function(it) {
            return loadedUsers.indexOf(it.uid) < 0;
        });
        if (notLoadedUsers && notLoadedUsers.length > 0){
          var notLoadedTitle = "Tracks weren't loaded for";
          angular.forEach(notLoadedUsers, function(it, i) {
            var separator = ((i + 1) !== notLoadedUsers.length) ? "," : ".";
            notLoadedTitle += " " + it["first_name"] + " " + it["last_name"] + separator;
          });
          toastService.showLong(notLoadedTitle);
        }
      }

    }

    function resetState() {
      // Refers to current playing track
      manager.scope.pointer.track = {};
      if (manager.scope.pointer.audio){
        manager.scope.pointer.audio.pause();
      }
      // Will be audio object
      manager.scope.pointer.audio = null;
      // Close popover
      manager.scope.popoverMembers && manager.scope.popoverMembers.hide();
    }

    function toggleTrack(track, index) {

      if (!angular.isDefined(index) && angular.isDefined(track.index)){
        index = track.index;
      }
      if (manager.scope.pointer.track.index !== index){
        // Disable previous track
        manager.scope.pointer.track.playing = false;
      }
      track.playing = !track.playing;
      var previousTrack = angular.copy(manager.scope.pointer.track);
      manager.scope.pointer.track = angular.extend(track, { index: index });

      if (manager.scope.pointer.track.index === previousTrack.index){
        if(!manager.scope.pointer.audio){
          initializeAudio(track.url);
        }
        if (track.playing){
          manager.scope.pointer.audio.play();
        }else{
          manager.scope.pointer.audio.pause();
        }
      }else{
        if (manager.scope.pointer.audio){
          manager.scope.pointer.audio.pause();
        }
        if (track.playing){
          initializeAudio(track.url);
          manager.scope.pointer.audio.play();
        }else{
          manager.scope.pointer.audio.pause();
        }
      }

    }

    function initializeAudio(url) {
      manager.scope.pointer.audio = new Audio(url);

      //start loading
      manager.scope.pointer.audio.addEventListener("loadstart", function() {
        setCurrentTime(null);
      });

      //start playing
      manager.scope.pointer.audio.addEventListener("timeupdate", function(e) {
        setCurrentTime(e.target.currentTime);
      });

      manager.scope.pointer.audio.addEventListener("ended", function() {
        continueToPlay();
      });

      manager.scope.pointer.audio.addEventListener("error", function(){
        setCurrentTime(null);
        continueToPlay();
      });

    }

    function continueToPlay() {
      manager.scope.$apply(function(){
        manager.scope.pointer.track.playing = false;
        var nextTrackIndex = manager.scope.pointer.track.index + 1;

        if (manager.scope.tracks[nextTrackIndex]){
          manager.scope.pointer.track = manager.scope.tracks[nextTrackIndex];
          manager.scope.pointer.track.playing = true;
          manager.scope.pointer.track.index = nextTrackIndex;

          initializeAudio(manager.scope.tracks[nextTrackIndex].url);
          manager.scope.pointer.audio.play();
        }
      });
    }

    function setCurrentTime(time) {
      manager.scope.$apply(function(){
        manager.scope.pointer.track.currentTime = time;
      });
    }

    function openPopoverMembers($event) {
      if (manager.scope.playlist && manager.scope.playlist.members && manager.scope.playlist.members.length > 0){
          manager.scope.popoverMembers.show($event);
      }
    }

    return manager;

  }

})();
