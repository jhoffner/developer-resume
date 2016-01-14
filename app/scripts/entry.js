'use strict';

var appDependencies = [
  'ng',
  'ui.router',
  'ngSanitize',
  'duScroll',
  'hljs'
];

angular
  .module('app', appDependencies)
  .config(appConfig);

require('./app.controller');
require('./about.controller');
require('./directives');

appConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

function appConfig ($stateProvider, $urlRouterProvider, $locationProvider) {
  var routes = [
    {
      name: 'resume',
      path: ''
    },
    {
      name: 'about',
      path: 'about'
    }
  ];

  routes.forEach(function(route){
    $stateProvider.state(route.name, {
      url: '/' + route.path,
      views: {
        guest: { templateUrl: 'views/' + route.name + '.html' }
      }
    });
  });

  $urlRouterProvider.otherwise("/404");
  $locationProvider.html5Mode(true);
}
