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

    function activate(scope) {

      manager.scope = scope;

      // Needed for view
      manager.scope.pointer = $rootScope.pointer = {};

      resetState();
      manager.scope.loaded = false;

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
      if (manager.scope.pointer.track.index !== index){
        // Disable previous track
        manager.scope.pointer.track.playing = false;
      }
      track.playing = !track.playing;
      var previousTrack = angular.copy(manager.scope.pointer.track);
      manager.scope.pointer.track = angular.extend(track, { index: index });

      if (manager.scope.pointer.track.index === previousTrack.index){
        if(!manager.scope.pointer.audio){
          manager.scope.pointer.audio = new Audio(track.url);
          manager.scope.pointer.audio.addEventListener("ended", continueToPlay);
          manager.scope.pointer.audio.addEventListener("error", continueToPlay);
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
          manager.scope.pointer.audio = new Audio(track.url);
          manager.scope.pointer.audio.addEventListener("ended", continueToPlay);
          manager.scope.pointer.audio.addEventListener("error", continueToPlay);
          manager.scope.pointer.audio.play();
        }else{
          manager.scope.pointer.audio.pause();
        }
      }

      function continueToPlay() {
        manager.scope.$apply(function(){
          manager.scope.pointer.track.playing = false;
          var nextTrackIndex = manager.scope.pointer.track.index + 1;

          if (manager.scope.tracks[nextTrackIndex]){
            manager.scope.pointer.track = manager.scope.tracks[nextTrackIndex];
            manager.scope.pointer.track.playing = true;
            manager.scope.pointer.track.index = nextTrackIndex;

            manager.scope.pointer.audio = new Audio(manager.scope.tracks[nextTrackIndex].url);
            manager.scope.pointer.audio.addEventListener("ended", continueToPlay);
            manager.scope.pointer.audio.addEventListener("error", continueToPlay);
            manager.scope.pointer.audio.play();
          }
        });
      }
    }

    function openPopoverMembers($event) {
      if (manager.scope.playlist && manager.scope.playlist.members && manager.scope.playlist.members.length > 0){
          manager.scope.popoverMembers.show($event);
      }
    }

    return manager;

  }

})();
