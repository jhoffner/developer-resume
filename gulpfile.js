'use strict';

var gulp = require('gulp'),
  jade = require('jade'),
  modRewrite = require('connect-modrewrite'),
  yaml = require('gulp-yaml'),
  ghPages = require('gulp-gh-pages');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del', 'browser-sync']
});

// Webpack
gulp.task('webpack', function() {
  return gulp.src('app/scripts/entry.js')
    .pipe($.webpack({
      module: {
        loaders: [
          { test: /\.json$/, loader: "json-loader" }
        ]
      },
      output: {
        filename: "app.js"
      }
    }))
    .pipe(gulp.dest('build/dev/scripts/'))
    .pipe($.browserSync.reload({stream:true}));
});

// Html
gulp.task('html:dev', function() {
  return gulp.src('build/dev/views/index.html')
    .pipe(gulp.dest('build/dev'))
    .pipe($.browserSync.reload({stream:true}));
});

gulp.task('html:dist', function() {
  return gulp.src('build/dist/views/index.html')
    .pipe(gulp.dest('build/dist'))
});

// Views
gulp.task('views:dev', function(){
  return gulp.src('app/views/**/*.jade')
    .pipe($.jade({
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest('build/dev/views'));
});

gulp.task('views:dist', function(){
  return gulp.src('app/views/**/*.jade')
    .pipe($.jade({
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest('build/dist/views'));
});

// Yaml
gulp.task('yaml:dev', function(){
  return gulp.src('app/resume.yml')
    .pipe(yaml())
    .pipe(gulp.dest('build/dev'));
});

gulp.task('yaml:dist', function(){
  return gulp.src('app/resume.yml')
    .pipe(yaml())
    .pipe(gulp.dest('build/dist'));
});

// Sass
gulp.task('sass', function () {
  return gulp.src('app/styles/app.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('build/dev/styles'))
    .pipe($.browserSync.reload({stream:true}));
});

// Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe(gulp.dest('build/dist/images/'))
    .pipe($.browserSync.reload({stream:true}));
});

// .htaccess
gulp.task('htaccess', function () {
  return gulp.src('.htaccess')
    .pipe(gulp.dest('build/dist/'));
});

// Static server
gulp.task('serve:dev', function() {
  $.browserSync({
    server: {
      baseDir: [".","build/dev","app"],
      middleware: [
        modRewrite([
          '!\\.html|\\.js|\\.css|\\.png|\\.jpg|\\.gif|\\.svg|\\.txt$ /index.html [L]'
        ])
      ]
    }
  });
});

gulp.task('serve:dist', function() {
  $.browserSync({
    server: {
      baseDir: ["build/dist"],
      middleware: [
        modRewrite([
          '!\\.html|\\.js|\\.css|\\.png|\\.jpg|\\.gif|\\.svg|\\.txt$ /index.html [L]'
        ])
      ]
    }
  });
});

// e2e tests
gulp.task('webdriver-update', $.protractor.webdriver_update);
gulp.task('protractor', ['webdriver-update'], function () {
  gulp.src(['test/e2e/**/*.js'])
    .pipe($.protractor.protractor({
      configFile: "test/protractor.config.js",
      args: ['--baseUrl', 'http://localhost:3000']
    }))
    .on('error', function (e) {
      throw e
    });
});

// Bower dependencies
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  return gulp.src('app/index.html')
    .pipe(wiredep({
      directory: 'bower_components'
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('bower', function() {
  return $.bower();
});

// Clean
gulp.task('clean', function () {
  $.del.sync(['build/dev/*', 'build/dist/*']);
});

// Default Task (Dev environment)
gulp.task('default', ['dev', 'serve:dev'], function(callback) {
  gulp.start('html:dev');

  // Scripts
  gulp.watch(['app/scripts/**/*.js'], ['webpack']);

  // Views
  $.watch('app/views/**/*.jade')
    .pipe($.jadeFindAffected())
    .pipe($.jade({jade: jade, pretty: true}))
    .pipe(gulp.dest('build/dev/views'));

  // Yaml
  gulp.watch('app/resume.yml', ['yaml:dev']);
  gulp.watch('build/dev/resume.json', ['html:dev']);

  // Htmls
  gulp.watch('build/dev/views/**/*.html', ['html:dev']);

  // Styles
  gulp.watch('app/styles/**/*.scss', ['sass']);
});

// Development
gulp.task('dev', ['clean', 'bower', 'webpack', 'sass', 'views:dev', 'html:dev', 'yaml:dev']);

gulp.task('deps', ['html:dist'], function () {
  var assets = $.useref.assets();

  return gulp.src(['build/dist/index.html'])
    // Concatenates asset files from the build blocks inside the HTML
    .pipe(assets)
    // Appends hash to extracted files app.css → app-098f6bcd.css
    .pipe($.rev())
    // Adds AngularJS dependency injection annotations
    .pipe($.if('*.js', $.ngAnnotate()))
    // Uglifies js files
    .pipe($.if('*.js', $.uglify()))
    // Minifies css files
    .pipe($.if('*.css', $.csso()))
    // Brings back the previously filtered HTML files
    .pipe(assets.restore())
    // Parses build blocks in html to replace references to non-optimized scripts or stylesheets
    .pipe($.useref({base: '/developer-resume'}))
    // Rewrites occurences of filenames which have been renamed by rev
    .pipe($.revReplace())
    // Minifies html
    .pipe($.if('*.html', $.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    })))
    // Creates the actual files
    .pipe(gulp.dest('build/dist/'))
    // Print the file sizes
    .pipe($.size({ title: 'build/dist/', showFiles: true }));
});

// Distribution
gulp.task('dist', ['clean', 'wiredep', 'dev', 'images', 'htaccess', 'views:dist', 'yaml:dist'], function () {
  gulp.start('deps');
});

gulp.task('serveprod', function() {
  return gulp.src('build/dev/views/index.html')
    .pipe(gulp.dest('build/dev'))
    .pipe($.browserSync.reload({stream:false}));
});

gulp.task('deploy', function() {
  return gulp.src('./build/dist/**/*')
    .pipe(ghPages());
});
