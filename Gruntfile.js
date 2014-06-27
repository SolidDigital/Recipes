/*globals module:true*/
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({});

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadTasks('grunt/configs');
    grunt.loadTasks('grunt/tasks');
};
