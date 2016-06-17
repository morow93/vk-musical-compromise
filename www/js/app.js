// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'ngCordovaOauth', 'LocalStorageModule'])

.run(['$ionicPlatform', '$cordovaOauth', 'AuthService', 'ToastrService', function($ionicPlatform, $cordovaOauth, authService, toastrService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    authService.run().then(function(res){
      toastrService.show('You got vk token!');
    }).catch(function(err) {
      toastrService.show('Opps! Error while getting vk token!');
    });

  });

}])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $stateProvider
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friends.html',
          controller: 'FriendsCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/tab/dash');

});
