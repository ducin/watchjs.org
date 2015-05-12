module.exports = function (grunt) {

    var idVideo = 0;
    var examples = require('./node_modules/grunt-json-mapreduce/examples');
    var _ = require('underscore');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cfg: {
            paths: {
                build: 'dist',
                bower: 'bower_components',
                npm: 'node_modules'
            },
            files: {
                js: {
                    vendor: [
                        '<%= cfg.paths.npm %>/underscore/underscore.js',
                        '<%= cfg.paths.bower %>/angular/angular.js',
                        '<%= cfg.paths.bower %>/angular-mocks/angular-mocks.js',
                        '<%= cfg.paths.bower %>/angular-route/angular-route.js',
                        '<%= cfg.paths.bower %>/angular-slugify/angular-slugify.js',
                        '<%= cfg.paths.bower %>/angular-youtube-mb/src/angular-youtube-embed.js',
//                        '<%= cfg.paths.bower %>/angular-youtube-embed/dist/angular-youtube-embed.js',
//                        '<%= cfg.paths.bower %>/angular-youtube/angular-youtube-player-api.js',
                        '<%= cfg.paths.bower %>/jquery/dist/jquery.js',
                        '<%= cfg.paths.bower %>/bootstrap/dist/js/bootstrap.js'
                    ],
                    mixins: [
                        'app/js/mixins/**/*.js'
                    ],
                    app: [
                        'app/js/app.js', 'app/js/**/*.js', '!app/js/mock/*'
                    ]
                },
                css: {
                    vendor: [
                        '<%= cfg.paths.bower %>/bootstrap/dist/css/bootstrap.css',
                        '<%= cfg.paths.bower %>/bootstrap/dist/css/bootstrap-theme.css'
                    ],
                    app: [
                        'app/assets/css/**/*.css'
                    ]
                }
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                pushTo: 'origin',
                commitFiles: ['-a']
            }
        },
        clean: {
            build: ['<%= cfg.paths.build %>']
        },
        copy: {
            static: {
                files: [{
                        '<%= cfg.paths.build %>/index.html': 'app/index.html',
                        '<%= cfg.paths.build %>/favicon.png': 'app/assets/favicon.png'
                    }, {
                        expand: true,
                        cwd: 'app/templates/',
                        src: ["*.*", "**/*.*"],
                        dest: '<%= cfg.paths.build %>/templates'
                    }, {
                        expand: true,
                        cwd: 'app/assets/font/',
                        src: ["*.*", "**/*.*"],
                        dest: '<%= cfg.paths.build %>/font'
                    }
                ]
            }
        },
        cssmin: {
            vendor: {
                files: {
                    '<%= cfg.paths.build %>/css/vendor.css': '<%= cfg.files.css.vendor %>'
                }
            },
            app: {
                files: {
                    '<%= cfg.paths.build %>/css/app.css': '<%= cfg.files.css.app %>'
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            vendor: {
                files: {
                    '<%= cfg.paths.build %>/js/vendor.js': '<%= cfg.files.js.vendor %>'
                }
            },
            mixins: {
                files: {
                    '<%= cfg.paths.build %>/js/mixins.js': '<%= cfg.files.js.mixins %>'
                }
            },
            app: {
                files: {
                    '<%= cfg.paths.build %>/js/app.js': '<%= cfg.files.js.app %>'
                }
            }
        },
        json_mapreduce: {
            events: {
                src: ['data/events/**/*.json'],
                dest: '<%= cfg.paths.build %>/data/events.json',
                options: {
                    map: examples.map.pass,
                    reduce: examples.reduce.concat
                }
            },
            videos: {
                src: ['data/videos/**/*.json'],
                dest: '<%= cfg.paths.build %>/data/videos.json',
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
                dest: '<%= cfg.paths.build %>/data/speakers.json',
                options: {
                    map: examples.map.pass,
                    reduce: examples.reduce.concat
                }
            },
            tags: {
                src: ['data/videos/**/*.json'],
                dest: '<%= cfg.paths.build %>/data/tags.json',
                options: {
                    map: function (currentValue, index, array) {
                        var tagLists = currentValue.map(function (element) {
                            return element.tags;
                        });
                        return _.union.apply(this, tagLists);
                    },
                    reduce: function(previousValue, currentValue, index, array) {
                        if (typeof previousValue === "undefined") {
                            return currentValue;
                        } else {
                            return _.union(previousValue, currentValue);
                        }
                    }
                }
            }
        },
        browserify: {
            app: {
                src: ['./app/js/mock/index.js'],
                dest: '<%= cfg.paths.build %>/js/mock.js'
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('mock', [
        'json_mapreduce',
        'browserify'
    ]);

    grunt.registerTask('build', [
        'clean',
        'mock',
        'copy',
        'cssmin',
        'uglify'
    ]);

    grunt.registerTask('default', ['build']);
};
