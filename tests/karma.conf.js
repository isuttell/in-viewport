module.exports = function(config)
{
    config.set(
    {

        basePath: '../',

        files: [
            'tests/vendor/**/*.js',
            'in-viewport.js',
            'tests/helpers/**/*.js',
            'tests/specs/**/*.js',
        ],

        autoWatch: false,

        frameworks: ['jasmine'],

        browsers: ['PhantomJS'],

        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-safari-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-story-reporter',
            'karma-html-reporter'
        ],

        coverageReporter:
        {
            dir: 'tests/coverage/',
            reporters: [
                // reporters not supporting the `file` property
                { type: 'html', subdir: 'html' },
                { type: 'lcovonly', subdir: 'lcov' },
                { type: 'text-summary' }
            ]
        },

        htmlReporter: {
            outputDir: 'tests/results/',
            templatePath: __dirname + '/reportTemplate.html'
        },

        reporters: ['story', 'html', 'coverage']

    });
};
