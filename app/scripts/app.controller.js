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
    return $scope;
  }
}
