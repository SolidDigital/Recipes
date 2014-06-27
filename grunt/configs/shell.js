'use strict';

module.exports = function(grunt) {

    grunt.config('shell', {
        options : {
            stdout : true,
            stderr : true,
            failOnError : true
        },
        build : {
            options : {
                execOptions: {
                    cwd: './app'
                }
            },
            command : 'jekyll build --safe'
        },
        server : {
            options : {
                execOptions: {
                    cwd: './app'
                }
            },
            command : 'jekyll serve --watch'
        }
    });
};
