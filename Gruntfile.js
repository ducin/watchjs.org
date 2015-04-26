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
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                pushTo: 'origin'
            }
        },
        clean: {
            build: ['<%= cfg.paths.build %>']
        },
        copy: {
            deps: {
                files: [{
                        '<%= cfg.paths.build %>/angular-youtube-embed.min.js': 'js/angular-youtube-embed.min.js',
                        '<%= cfg.paths.build %>/app.js': 'js/app.js',
                        '<%= cfg.paths.build %>/underscore-mixins.js': 'js/underscore-mixins.js',
                        '<%= cfg.paths.build %>/main.css': 'css/main.css',
                        '<%= cfg.paths.build %>/bootstrap.css': 'bower_components/bootstrap/dist/css/bootstrap.css',
                        '<%= cfg.paths.build %>/bootstrap-theme.css': 'bower_components/bootstrap/dist/css/bootstrap-theme.css',
                        '<%= cfg.paths.build %>/index.html': 'index.html',
                        '<%= cfg.paths.build %>/favicon.png': 'favicon.png'
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
                    reduce: examples.reduce.concat
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
                    reduce: examples.reduce.concat
                }
            },
            speakers: {
                src: ['data/speakers/**/*.json'],
                dest: '<%= cfg.paths.build %>/speakers.json',
                options: {
                    map: examples.map.pass,
                    reduce: examples.reduce.concat
                }
            }
        },
        browserify: {
            app: {
                src: ['./js/mock.js'],
                dest: '<%= cfg.paths.build %>/mock.js'
            }
        }
    });
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('build', ['clean', 'json_mapreduce', 'browserify', 'copy', 'uglify']);
    grunt.registerTask('default', ['build']);
};
