'use strict';

module.exports = function(grunt) {

    grunt.config('shell', {
        options : {
            stdout : true,
            stderr : true,
            failOnError : true,
            execOptions: {
                cwd: './app'
            }
        },
        build : {
            options : {
                execOptions: {
                    cwd: './app'
                }
            },
            command : 'jekyll build'
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
