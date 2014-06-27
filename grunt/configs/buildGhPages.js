/*globals module:true */
module.exports = function (grunt) {
    'use strict';

    grunt.config('buildGhPages', {
        site : {
            options : {
                dist : 'build',
                build_branch : 'gh-pages'
            }
        }
    });

};
