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

      scope.shouldShowGroup = function(project, group) {
        var roleKey = scope.$parent.role;
        if (roleKey) {
          return project[group].some(function(hl) {
            return (hl.roles || []).indexOf(roleKey) >= 0;
          });
        }

        var skillKey = scope.$parent.skill;
        if (skillKey) {
          return project[group].some(function(hl) {
            return (hl.skills || []).indexOf(skillKey) >= 0;
          });
        }

        return true;
      }

      scope.shouldShowItem = function(item) {
        var roleKey = scope.$parent.role;
        if (roleKey) {
          if ((item.roles || []).indexOf(roleKey) == -1) return false;
        }

        var skillKey = scope.$parent.skill;
        if (skillKey) {
          if ((item.skills || []).indexOf(skillKey) == -1) return false;
        }

        return true;
      }

      scope.shouldShowTeam = function() {
        var roleKey = scope.$parent.role;

        if (roleKey) {
          var existing = (scope.team.projects || []).some(function(project) {
            return project.roles.indexOf(roleKey) >= 0;
          });
          if (!existing) false;
        }

        var skillKey = scope.$parent.skill;
        if (skillKey) {
          var existing = (scope.team.projects || []).some(function(project) {
            return project.skills.indexOf(skillKey) >= 0;
          });

          if (!existing) return false;
        }

        return true;
      }

      scope.filterName = function() {
        return scope.$root.role || scope.$root.skill;
      }
    }
  };
}

function highlight () {
  return {
    restrict: 'E',
    scope: { keys: '@', item: '=' },
    template: '<li ng-if="shouldShow()" ng-bind-html="html()"></li>',
    link: function(scope) {
      scope.html = function() {
        var text = scope.item.text;
        (scope.item.skills || []).forEach(function(skill) {
          text = text.replace(new RegExp(skill, "g"), "<span class='tag'>" + skill + "</span>");
        });


        // also allow [[token]] values to be
        text = text.replace(/`(.*)`/g, '<span class="tag">$1</span>')
        return text;
      }
      scope.shouldShow = function() {
        var skillKey = scope.$root.skill;
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
    template: '<a class="clear-filters" ng-click="clear()">Remove Filter</a>',
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
        return !scope.category || skill.category == scope.category;
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
        setTimeout(function() {
          // clientY helps restore the offset, -10 helps fix a jitter issue
          $document.scrollToElement(el, ev.clientY - 10, 0);
        }, 0);
      });
    }
  };
}
