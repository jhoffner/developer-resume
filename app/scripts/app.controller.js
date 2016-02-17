'use strict';

angular
  .module('app')
  .controller('AppController', AppController);

AppController.$inject = ['$rootScope', '$http', '$document', '$window', '$timeout'];

function AppController($scope, $http, $document, $window, $timeout){
  $http.get('resume.json')
    .success(function(data) {
      $scope.resume = prepResumeData(data);
    });

  $scope.view = 'detailed';

  // could be toggled to still show partial company/project information even if they
  // do not match the filter
  $scope.hideAllOnFilter = true;

  $scope.tagLabel = function(tag) {
    return tag.name || tag;
  }

  $scope.filter = function filter(type, name) {
    $scope.filter[type] = $scope.filter[type] == name ? null : name;
    // TODO: convert to a single filter property
    // we now only allow one filter at a time, so null the other one
    $scope.filter[type == 'role' ? 'skill' : 'role'] = null;
    filterProjects(type, name);

    return $scope;
  }

  $scope.hasActiveFilter = function() {
    return $scope.filter.role || $scope.filter.skill;
  }

  $scope.goto = function(id) {
    var el = angular.element(document.getElementById(id));
    $document.scrollToElement(el, 50, 200);
  }

  $scope.filterName = function() {
    return $scope.filter.role || $scope.filter.skill;
  }

  function filterProjects(type, name) {
    $scope.filteredProjects = [];
    if (name) {
      $scope.resume.projects.forEach(function(project) {
        if ((project[type + 's'] || []).indexOf(name) >= 0) {
          $scope.filteredProjects.push(project);
        }
      });
    }
  }

  // updates the data to be in a more useful format for display
  function prepResumeData(resume) {
    resume.work.forEach(function(company) {
      company.projects = companyProjects(company);
    });

    resume.sideProjects = resume.projects.filter(function(project) {
      return !project.company
    });

    $window.scope = $scope;
    return resume;

    function companyProjects(company) {
      return resume.projects.filter(function(project) {
        return project.company === company.company;
      });
    }
  }
}


