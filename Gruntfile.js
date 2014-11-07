module.exports = function (grunt)
{
    // Lazy Load
    require('jit-grunt')(grunt);

    // Project configuration.
    grunt.initConfig(
    {
        pkg: grunt.file.readJSON('package.json'),
        uglify:
        {
            options:
            {
                banner: '/*!\n * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.homepage %>\n * <%= pkg.description %>\n * Contributor(s): <%= pkg.author %>\n */\n\n',
                report: 'min',
                 mangle: {
                    except: ['InViewport']
                  }
            },
            build:
            {
                files:
                {
                    'in-viewport.min.js': ['in-viewport.js'],
                }
            }
        },
        jshint:
        {
            options:
            {
                jshintrc: true
            },
            default: ['in-viewport.js']
        },
        jsvalidate: {
            options:
            {
                globals: {},
                esprimaOptions: {},
                verbose: false
            },
            build:
            {
                files:
                {
                    src: ['in-viewport.js']
                }
            }
        },
        jscs: {
            options: {
                config: ".jscsrc"
            },
            default: {
                files: {
                  src: ['in-viewport.js']
                }
            },
        },
        watch: {
            options: {
                interrupt: true // Interrupt any running tasks on save
            },
            js: {
                files: ['in-viewport.js', 'jshint', 'jsvalidate'],
                tasks: ['jscs']
            },
            karma: {
                files: ['in-viewport.js', 'tests/specs/**/*.js'],
                tasks: ['karma:watch:run']
            }
        },
        karma: {
            options:
            {
                configFile: 'tests/karma.conf.js',
                separator: '',
                preprocessors: {
                    'in-viewport.js': 'coverage'
                },
            },
            build:
            {
                options:
                {
                    singleRun: true,
                    browsers: ['PhantomJS'],
                    logLevel: 'INFO'
                }
            },
            watch:
            {
                options:
                {
                    background: true,
                    browsers: ['PhantomJS'],
                    logLevel: 'ERROR',
                    reporters: ['dots', 'coverage']
                }
            },
            all:
            {
                options:
                {
                    singleRun: true,
                    browsers: ['PhantomJS', 'Chrome', 'Firefox', 'Safari'],
                    logLevel: 'INFO'
                }
            }
        }
    });

    /*
	|--------------------------------------------------------------------------
	| Tasks
	|--------------------------------------------------------------------------
	|
	*/

    grunt.registerTask('lint', ['jscs', 'jshint', 'jsvalidate']);
    grunt.registerTask('test', ['lint', 'karma:build']);

    grunt.registerTask('build', ['test', 'uglify']);
    grunt.registerTask('default', ['karma:watch:start', 'watch']);
};
