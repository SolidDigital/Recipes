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
            command : 'jekyll build'
        },
        server : {
            command : 'jekyll serve'
        }
    });
};
