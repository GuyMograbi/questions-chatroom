module.exports = function(config) {
    var configuration = {
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'bower_components/angular/angular.min.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/ngenter/ngenter.js',
            'bower_components/moment/moment.js',
            'bower_components/angular-moment/angular-moment.js',
            'bower_components/lodash/lodash.js',
            'app/scripts/*.js',
            'app/scripts/**/*.js',
            'test/frontend/*.js',
            'test/frontend/**/*.js'
        ],

        // list of files to exclude
        preprocessors: {
            'app/scripts/**/*.js': ['coverage']
        },

        reporters: ['failed', 'coverage'],
        port: 8080,
        runnerPort: 9100,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Chrome'],
        //browsers: ['PhantomJS'],
        captureTimeout: 20000,
        singleRun: true,
        reportSlowerThan: 500,
        coverageReporter: {
            reporters: [  {type: 'html' },{ type: 'cobertura'} ]
        },
        plugins: [
            'karma-jasmine',
            'karma-coverage',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-spec-reporter',
            'karma-failed-reporter',
        ]
    };

//    if (process.env.TRAVIS) {
//        configuration.browsers = ['Chrome_travis_ci'];
//    }

    config.set(configuration);
};