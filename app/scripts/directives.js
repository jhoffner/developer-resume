'use strict';

angular
  .module('app')
  .directive('resumeSection', resumeSection)
  .directive('filterTag', filterTag)
  .directive('highlight', highlight)
  .directive('clearFilters', clearFilters)
  .directive('tagsList', tagsList)
  .directive('team', team)
  .directive('tagsUsed', tagsUsed);

function resumeSection () {
  return {
    restrict: 'E',
    transclude: true,
    scope: { label: '@' },
    templateUrl: 'views/directives/resume-section.html'
  };
}

function team () {
  function projectHasSkill(project, skill) {
    return project.roles.some(function(role) {
      return role.skills.indexOf(skill) > -1;
    });
  }

  return {
    restrict: 'E',
    scope: { team: '=' },
    templateUrl: 'views/directives/team.html',
    link: function(scope) {

      scope.shouldShowHighlights = function(role) {
        let skillKey = scope.$parent.skill;
        if (skillKey) {
          return role.highlights.some(function(hl) {
            return (hl.skills || []).indexOf(skillKey) >= 0;
          });
        }

        return true;
      }

      scope.shouldShowRole = function(role){
        if (scope.$parent.role && scope.$parent.role != role.name) {
          return false;
        }

        if (scope.$parent.skill && role.skills.indexOf(scope.$parent.skill) == -1) {
          return false;
        }

        return true;
      }

      scope.shouldShowProject = function(project) {
        let roleKey = scope.$parent.role;

        if (roleKey) {
          let existing = project.roles.some(function(role) {
            return role.name === roleKey;
          });

          if (!existing) return false;
        }

        let skillKey = scope.$parent.skill;
        if (skillKey && !projectHasSkill(project, skillKey)) {
          return false;
        }

        return true;
      }

      scope.shouldShowTeam = function() {
        let roleKey = scope.$parent.role;

        if (roleKey && scope.team.roles.indexOf(roleKey) == -1) {
          return false;
        }

        let skillKey = scope.$parent.skill;
        if (skillKey) {
          let existing = (scope.team.projects || []).some(function(project) {
            return projectHasSkill(project, skillKey)
          });

          if (!existing) return false;
        }

        return true;
      }
    }
  };
}

function highlight () {
  return {
    restrict: 'E',
    scope: { keys: '@', item: '=' },
    template: '<li ng-if="shouldShow()" ng-bind-html="item.text"></li>',
    link: function(scope) {
      scope.shouldShow = function() {
        let skillKey = scope.$root.skill;
        if (skillKey) {
          return (scope.item.skills || []).indexOf(skillKey) >= 0;
        }
        return true;
      }
    }
  };
}

function clearFilters () {
  return {
    restrict: 'E',
    template: '<a class="clear-filters" ng-click="clear()">Clear All Filters</a>',
    link: function(scope) {
      scope.clear = function() {
        scope.$root.skill = null;
        scope.$root.role = null;
      }
    }
  };
}

function tagsUsed () {
  return {
    restrict: 'E',
    transclude: true,
    scope: {items: '=', label: '@', type: '@'},
    templateUrl: 'views/directives/tags-used.html'
  };
}

function tagsList () {
  return {
    restrict: 'E',
    transclude: true,
    scope: { label: '@', category: '@', ulClass: '@', collection: '=', type: '@' },
    templateUrl: 'views/directives/tags-list.html',
    link: function(scope) {
      if (!scope.collection) {
        scope.collection = scope.$root.resume[scope.type + 's'];
      }
      scope.items = scope.collection.filter(function(skill) {
        return skill.category == scope.category;
      });
    }
  };
}

function filterTag ($document) {
  return {
    restrict: 'E',
    scope: { years: '@', label: '@', type: '@', disabled: '=' },
    templateUrl: 'views/directives/filter-tag.html',
    link: function(scope, el) {
      scope.cssClass = function() {
        return scope.$root[scope.type] === scope.label ? 'active' : '';
      }

      scope.filter = function() {
        scope.$root.filter(scope.type, scope.label);
      }

      scope.yearName = function() {
        switch (scope.years) {
          case '0':
            return '< 1 years';
          case '1':
            return '1 year';
          default:
            return scope.years + ' years';
        }
      }

      // after a user clicks on a filter we don't want the page to jump
      el.on('click', function(ev) {
        console.log(ev);
        setTimeout(function() {
          // clientY helps restore the offset, -10 helps fix a jitter issue
          $document.scrollToElement(el, ev.clientY - 10);
        }, 100);
      });
    }
  };
}
