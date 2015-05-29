'use strict';

angular
  .module('app')
  .controller('AppController', AppController);

AppController.$inject = ['$rootScope', '$http'];

function AppController($scope, $http){
  $http.get('resume.json')
    .success(function(data) {
      $scope.resume = data;
    });

  $scope.name = 'Jake Hoffner';
  $scope.careerTitle = 'Fullstack Web Architect';

  $scope.tagLabel = function(tag) {
    return tag.name || tag;
  }

  $scope.filter = function filter(type, name) {
    $scope[type] = $scope[type] == name ? null : name;
    // TODO: convert to a single filter property
    // we now only allow one filter at a time, so null the other one
    $scope[type == 'role' ? 'skill' : 'role'] = null;

    return $scope;
  }
}
