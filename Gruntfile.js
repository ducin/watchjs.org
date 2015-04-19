module.exports = function (grunt) {

    var idVideo = 0;
    var examples = require('./node_modules/grunt-json-mapreduce/examples');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cfg: {
            paths: {
                build: 'dist'
            },
            files: {
                vendor: [
                    'bower_components/underscore/underscore.js',
                    'bower_components/angular/angular.js',
                    'bower_components/angular-mocks/angular-mocks.js',
                    'bower_components/angular-route/angular-route.js',
                    'bower_components/angular-slugify/angular-slugify.js',
                    'bower_components/angular-youtube/angular-youtube-player-api.js',
                    'bower_components/angular-youtube-embed/dist/angular-youtube-embed.js',
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/bootstrap/dist/js/bootstrap.js'
                ]
            }
        },
        clean: {
            build: ['<%= cfg.paths.build %>']
        },
        copy: {
            deps: {
                files: [{
                        'dist/angular-youtube-embed.min.js': 'js/angular-youtube-embed.min.js',
                        'dist/main.css': 'css/main.css',
                        'dist/bootstrap.css': 'bower_components/bootstrap/dist/css/bootstrap.css',
                        'dist/bootstrap-theme.css': 'bower_components/bootstrap/dist/css/bootstrap-theme.css',
                        'dist/index.html': 'index.html'
                    }, {
                        expand: true,
                        cwd: 'templates/',
                        src: ["*.*", "**/*.*"],
                        dest: '<%= cfg.paths.build %>/templates'
                    }, {
                        expand: true,
                        cwd: 'font/',
                        src: ["*.*", "**/*.*"],
                        dest: '<%= cfg.paths.build %>/font'
                    }]
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            vendor: {
                src: '<%= cfg.files.vendor %>',
                dest: '<%= cfg.paths.build %>/vendor.js'
            }
        },
        json_mapreduce: {
            events: {
                src: ['data/events/**/*.json'],
                dest: '<%= cfg.paths.build %>/events.json',
                options: {
                    map: examples.map.pass,
                    reduce: examples.reduce.concat,
                    debug: examples.debug.logStringify
                }
            },
            videos: {
                src: ['data/videos/**/*.json'],
                dest: '<%= cfg.paths.build %>/videos.json',
                options: {
                    map: function (currentValue, index, array) {
                        return currentValue.map(function (element) {
                            element.id = ++idVideo;
                            return element;
                        });
                    },
                    reduce: examples.reduce.concat,
                    debug: examples.debug.logStringify
                }
            },
            speakers: {
                src: ['data/speakers/**/*.json'],
                dest: '<%= cfg.paths.build %>/speakers.json',
                options: {
                    map: examples.map.pass,
                    reduce: examples.reduce.concat,
                    debug: examples.debug.logStringify
                }
            }
        },
        browserify: {
            app: {
                src: ['./js/app.js'],
                dest: '<%= cfg.paths.build %>/app.js'
            }
        }
    });
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('build', ['clean', 'json_mapreduce', 'browserify', 'copy', 'uglify']);
    grunt.registerTask('default', ['build']);
};
