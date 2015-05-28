'use strict';

angular
  .module('app')
  .controller('AppController', AppController);

AppController.$inject = ['$rootScope'];

function AppController ($scope){
  $scope.name = 'Jake Hoffner';
  $scope.careerTitle = 'Fullstack Web Architect';
  $scope.tags = {
    "frontend":"Frontend Web Development",
    "backend":"Backend Web Development",
    "web-architecture":"Web Architecture",
    "tech-leadership":"Technical Leadership",
    "agile-pm":"Agile Project Management",
    "product-management":"Product Management",
    "ux-design":"UX Design",
    "devops":"Devops",
    "ror":"Ruby On Rails",
    "js":"JavaScript",
    "angularjs":"AngularJS",
    "html":"CSS/HTML",
    "c#":"C#",
    "aspnetmvc":"ASP.NET MVC",
    "aws":"AWS",
    "docker":"Docker",
    "mongodb":"MongoDB",
    "sqlserver":"SQL Server",
    "nodejs":"Node.js",
    "jquery":"jQuery",
    "redis":"Redis",
    "memcached":"Memcached",
    "coffee":"CoffeeScript",
    "Sketch":"Sketch",
    "git":"Git",
    "gulp":"Gulp",
    "digital-ocean":"Digital Ocean",
    "heroku":"Heroku",
    "elastic-search":"ElasticSearch",
    "xml":"XML",
    "svn":"SVN",
    "flash":"Flash",
    "asp-net":"ASP.NET",
    "asp":"ASP",
    "xslt": "XSLT",
    "sass": "SASS",
    "less": "Less",
    "ruby": "Ruby",
    "nginx": "Nginx",
    "web-sockets": "Web Sockets"
  };

  $scope.teams = [
    {
      personal: false,
      name: 'Entrefuse',
      date: 'Oct 2012 - Present',
      title: 'CTO',
      summary: 'My responsibility as CTO required me to handle all initial development before the team expanded. My role grew into more of a leadership role as the team expanded.',
      roles: ['backend', 'frontend', 'web-architecture', 'tech-leadership', 'agile-pm', 'product-management', 'devops'],
      projects: [{
        name: 'Codewars.com',
        type: 'Website',
        url: 'http://www.codewars.com',
        summary: 'Codewars.com that enables developers to dramatically improve their coding skills through the use of small coding challenges called "kata".',
        skills: ['ror', 'ruby', 'js', 'coffee', 'git', 'mongodb', 'web-sockets', 'jquery', 'sass'],
        roles: [{
          key: 'backend',
          skills: ['ror', 'ruby', 'git', 'mongodb', 'redis', 'memcached', 'web-sockets'],
          highlights: [{
            text: "Extended <span class='tag'>Rails</span> to handle the concept known as PJAX on a more integrated and deeper level",
            skills: ['ror', 'ruby', 'javascript']
          }, {
            text: "Implemented a concept dubbed DJAX (Deferred AJAX) to allow <span class='tag'>Rails</span> to handle slow-client requests by leveraging <span class='tag'>Web Sockets</span> and <span class='tag'>Redis</span>.",
            skills: ['ror', 'ruby', 'redis', 'web-sockets']
          }]
        }, {
          key: 'frontend',
          skills: ['jquery', 'coffee', 'sass'],
          highlights: [{
            text: 'Wrote all of the front-end codebase myself.'
          },{
            text: "Built a custom client-side templating engine complete with limited two-way bindings utilizing <span class='tag'>jQuery</span> as the core framework",
            skills: ['coffee', 'jquery']
          }, {
            text: "Built a custom client-side application framework built on top of <span class='tag'>jQuery</span> that uses a hybrid design leveraging PJAX.",
            skills: ['coffee', 'jquery']
          }]
        }]
      }, {
        name: 'Strive.co',
        url: 'http://strive.co',
        type: 'Website',
        summary: 'Strive.co is recruitement based product focused on placing skilled web developers into their dream positions.',
        roles: [{
          key: 'backend',
          skills: ['ror', 'ruby', 'nodejs', 'js', 'docker', 'git', 'mongodb', 'redis', 'memcached', 'web-sockets', 'nginx'],
          samples: [{
            name: 'jBuilder Model Serializer',
            skills: ['ror']
          }, {
            name: 'Filter API',
            skills: ['ror']
          }],
          highlights: [{
            text: "Architected the entire <span class='tag'>Rails</span> API and data model for the site.",
            skills: ['ror']
          }, {
            text: "Improved jbuilder performance by bypassing the need to use the <span class='tag'>Rails</span> templating system.",
            skills: ['ror']
          }, {
            text: "Built a sophisticated and flexible <span class='tag'>Rails</span> API scheme that allowed for multiple front-end clients to interface with it.",
            skills: ['ror']
          }, {
            text: "Implemented a micro-service oriented architecture leveraging <span class='tag'>Docker</span> and <span class='tag'>Nginx</span> to link <span class='tag'>Node.js</span> and <span class='tag'>Rails</span> services together.",
            skills: ['ror', 'docker', 'nginx', 'nodejs']
          }],
        }],
      }],
    }, {
      personal: false,
      name: 'DirecTV',
      date: '2008 - 2012',
      title: 'Lead Web Developer',
      summary: 'I spent the majority of my time at DirecTV leading up front-end JavaScript development for their main website.',
      roles: ['frontend', 'agile-pm'],
    }
  ];

  $scope.filter = function filter(type, key) {
    $scope[type] = $scope[type] === key ? null : key;
    return $scope;
  }
}
