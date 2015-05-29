'use strict';

angular
  .module('app')
  .controller('AppController', AppController);

AppController.$inject = ['$rootScope', '$http', '$document'];

function AppController($scope, $http, $document){
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
    filterProjects(type, name);

    return $scope;
  }

  $scope.activeFilter = function() {
    return $scope.role || $scope.skill;
  }

  function filterProjects(type, name) {
    $scope.filteredProjects = [];
    if (name) {
      $scope.resume.teams.forEach(function(team) {
        (team.projects || []).forEach(function(project) {
          if ((project[type + 's'] || []).indexOf(name) >= 0) {
            $scope.filteredProjects.push(project);
          }
        });
      });
    }
  }

  $scope.goto = function(id) {
    var el = angular.element(document.getElementById(id));
    $document.scrollToElement(el, 50, 200);
  }
}
