'use strict';

module.exports = function (config) {

  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '..',

    // frameworks to use
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/jquery/dist/jquery.js',
      'app/bower_components/ace-builds/src-noconflict/ace.js',
      'app/bower_components/ace-builds/src-noconflict/ext-language_tools.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-animate/angular-animate.js',
      'app/bower_components/angular-recursion/angular-recursion.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/bower_components/angular-ui-ace/ui-ace.js',
      'app/bower_components/ngUpload/ng-upload.min.js',
      'app/bower_components/bonita-js-components/dist/bonita-lib-tpl.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-gettext/dist/angular-gettext.min.js',
      'app/bower_components/moment/min/moment.min.js',
      'app/bower_components/angular-moment/angular-moment.min.js',
      'app/bower_components/keymaster/keymaster.js',

      'app/js/**/*.module.js',
      'app/js/**/*.js',
      'app/js/**/*.html',

      'test/unit/utils/*.js',
      'test/unit/**/*.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'junit', 'coverage'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'app/js/**/*.js': ['coverage'],
      'app/js/**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/',
      moduleName: 'bonitasoft.ui.templates'
    },

    coverageReporter: {
      type: 'lcov',
      dir: 'build/reports/coverage/'
    },

    junitReporter: {
      outputFile: 'build/reports/unit-tests/test-results.xml',
      suite: 'JavaScript unit tests'
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
