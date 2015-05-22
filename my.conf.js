// Karma configuration
// Generated on Sat Oct 18 2014 13:54:14 GMT-0200 (UYST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        './static/angular/angular.js',
        './static/jquery/js/*.js',
        './static/bootstrap/js/*.js',
        './static/angular/angular-mocks.js',
        './static/angular/d3.js',
        './static/angular/angular-charts.js',
        './static/angular/*.js',
        './static/js/validators/validatorFactory.js',
        './static/js/validators/*.js',
        './static/js/operators/operatorFactory.js',
        './static/js/operators/operatorField.js',
        './static/js/operators/operatorList.js',
        './static/js/operators/operatorNumber.js',
        './static/js/operators/operatorChecks.js',
        './static/js/fields/FieldFactory.js',
        './static/js/fields/*.js',
        './static/js/appVisor.js',
        './static/js/app.js',
        './static/js/visorCtrl.js',
        './static/js/editorCtrl.js',
        './static/js/mainpageCtrl.js',
        './testing/mainPage_test.js',
        './testing/visor_tests.js',
        './testing/editor_test.js',
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
