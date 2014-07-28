/*globals module:true */
module.exports = function (grunt) {
    'use strict';

    grunt.config('shell', {
        buildAdmin : {
            options : {
                stdout : true,
                stderr : true,
                failOnError : true
            },
            command : './node_modules/.bin/grasshopper build'
        },
        deployHeroku : {
            options : {
                stdout : true,
                stderr : true,
                failOnError : true
            },
            command : 'git push heroku master'
        },
        setupHerokuEnvVariables : {
            options : {
                stdout : true,
                stderr : true,
                failOnError : true
            },
            command : 'heroku config:set GHCONFIG=\'<%= ghapiConfigs %>\''
        },
        mongoExport : {
            options : {
                stdout : true,
                stderr : true,
                failOnError : true
            },
            command : 'mongoexport --jsonArray --db <%= mongo.database %> -c <%= collection %> --host <%= mongo.shorthost %> ' +
            '<%= mongo.username ? "--username " + mongo.username : "" %> ' +
            '<%= mongo.password ? "--password " + mongo.password : "" %> ' +
            '--out .data/<%= fixtureFolder %>/<%= collection %>.json'
        },
        mongoImport :{
            options : {
                stdout : true,
                stderr : true,
                failOnError : true
            },
            command : 'mongoimport --drop --jsonArray --db <%= mongo.database %> -c <%= collection %> --host <%= mongo.shorthost %> ' +
            '<%= mongo.username ? "--username " + mongo.username : "" %> ' +
            '<%= mongo.password ? "--password " + mongo.password : "" %> ' +
            '--file .data/<%= fixtureFolder %>/<%= collection %>.json'
        },
        start : {
            options : {
                stdout : true,
                stderr : true,
                failOnError : true
            },
            command : 'GHCONFIG=\'<%= ghapiConfigs %>\' node app'
        }
    });

    grunt.loadNpmTasks('grunt-shell');
};