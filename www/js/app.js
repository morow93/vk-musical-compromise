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
      //toastrService.show('You got vk token!');
    }).catch(function(err) {
      //toastrService.show('Opps! Error while getting vk token!');
    });

  });

}])

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {

  $ionicConfigProvider.form.checkbox("circle");

  $stateProvider
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('tab.list', {
    url: '/list',
    views: {
      'tab-list': {
        templateUrl: 'templates/list.html',
        controller: 'ListCtrl'
      }
    }
  })
  .state('tab.new', {
      url: '/new',
      views: {
        'tab-new': {
          templateUrl: 'templates/new.html',
          controller: 'NewCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/tab/list');

});
