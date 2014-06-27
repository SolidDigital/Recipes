/* jshint node:true */
module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('deploy', ['shell:build', 'buildGhPages:site']);

};
