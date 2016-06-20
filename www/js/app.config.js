(function() {

  "use strict";

  angular.module("app").config(config);

  config.$inject = ["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider"];

  function config($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.form.checkbox("circle");

    $stateProvider
      .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'js/pages/tabs/tabs.html'
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
      });

    $urlRouterProvider.otherwise('/tab/list');
  }

})();
