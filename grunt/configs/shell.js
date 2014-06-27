'use strict';

module.exports = function(grunt) {

    grunt.config('shell', {
        options : {
            stdout : true,
            stderr : true,
            failOnError : true
        },
        'build' : {
            command : 'jekyll build'
        }
    });
};
