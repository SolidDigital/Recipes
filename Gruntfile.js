/*globals module:true*/
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        environment : 'heroku',
        portToUse : 3000,
        warning : { readme : 'Compiled file. Do not edit directly. '},
        pkg: grunt.file.readJSON('package.json')
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadTasks('grunt/configs');
    grunt.loadTasks('grunt/tasks');
};
