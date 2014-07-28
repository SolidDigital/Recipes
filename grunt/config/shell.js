/*globals module:true */
module.exports = function (grunt) {
    'use strict';

    grunt.config('shell', {

        deployHeroku : {
            options : {
                stdout : true,
                stderr : true,
                failOnError : true
            },
            command : 'git push heroku master'
        },
        setupLocalEnvVariables : {
            options : {
                stdout : true,
                stderr : true,
                failOnError : true
            },
            command : 'export GHCONFIG=\'<%= ghapiConfigs %>\''
        },
        setupHerokuEnvVariables : {
            options : {
                stdout : true,
                stderr : true,
                failOnError : true
            },
            command : 'heroku config:set GHCONFIG=\'<%= ghapiConfigs %>\''
        },
        start : {
            options : {
                stdout : true,
                stderr : true,
                failOnError : true
            },
            command : 'node app'
        }
    });

    grunt.loadNpmTasks('grunt-shell');
};