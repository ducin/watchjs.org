module.exports = function (grunt) {

    var idVideo = 0;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: ['dist']
        },
        copy: {
            deps: {
                files: [{
                        'dist/angular-youtube-embed.min.js': 'js/angular-youtube-embed.min.js',
                        'dist/main.css': 'css/main.css',
                        'dist/index.html': 'index.html'
                    }, {
                        expand: true,
                        cwd: "templates/",
                        src: ["*.*", "**/*.*"],
                        dest: "dist/templates",
                    }]
            }
        },
        browserify: {
            app: {
                src: ['./js/app.js'],
                dest: 'dist/app.js'
            }
        },
        json_mapreduce: {
            events: {
                src: ['data/events/**/*.json'],
                dest: 'dist/events.json',
                options: {
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Map
                    // https://docs.python.org/2/library/functions.html#map
                    map: function (currentValue, index, array) {
                        return currentValue;
                    },
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
                    // https://docs.python.org/2/library/functions.html#reduce
                    reduce: function (previousValue, currentValue, index, array) {
                        if (typeof previousValue === "undefined") {
                            return currentValue;
                        } else {
                            return previousValue.concat(currentValue);
                        }
                    }
                }
            },
            videos: {
                src: ['data/videos/**/*.json'],
                dest: 'dist/videos.json',
                options: {
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Map
                    // https://docs.python.org/2/library/functions.html#map
                    map: function (currentValue, index, array) {
                        return currentValue.map(function (element) {
                            element.id = ++idVideo;
                            return element;
                        });
                    },
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
                    // https://docs.python.org/2/library/functions.html#reduce
                    reduce: function (previousValue, currentValue, index, array) {
                        if (typeof previousValue === "undefined") {
                            return currentValue;
                        } else {
                            return previousValue.concat(currentValue);
                        }
                    },
                    debug: function (value) {
                        grunt.log.oklns("Elements: " + value.length);
                    }
                }
            }
        }
    });
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('build', ['clean', 'json_mapreduce', 'browserify', 'copy']);
    grunt.registerTask('default', ['build']);
};
