(function() {

  "use strict";

  angular.module("app").config(config);

  config.$inject = ["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider"];

  function config($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.form.checkbox("circle");
    $ionicConfigProvider.tabs.position("bottom");

    $stateProvider
      .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'js/pages/pages.html',
      controller: 'PagesController'
    })
    .state('tab.list', {
      url: '/list',
      views: {
        'tab-list': {
          templateUrl: 'js/pages/list/list.html',
          controller: 'ListController'
        }
      }
    })
    .state('tab.new', {
        url: '/new',
        views: {
          'tab-new': {
            templateUrl: 'js/pages/new/new.html',
            controller: 'NewController'
          }
        }
    })
    .state('tab.details', {
      url: '/list/:playlistId',
      views: {
        'tab-list': {
          templateUrl: 'js/pages/details/details.html',
          controller: 'DetailsController'
        }
      }
    });

    $urlRouterProvider.otherwise('/tab/list');
  }

})();
