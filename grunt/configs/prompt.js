/*globals module:true*/
module.exports = function(grunt) {
    'use strict';

    var envsData = ['local', 'heroku'];

    grunt.config.set('prompt', {
        data : {
            options : {
                questions : [
                    getEnvQuestion(envsData)
                ]
            }
        },
        server : {
            options : {
                questions : [
                    getEnvQuestion(envsData)
                ]
            }
        }
    });

    function getEnvQuestion(choices, defaultEnv) {
        return {
            config : 'environment',
            type : 'list', // list, checkbox, confirm, input, password
            message : 'Which environment would you like to use?',
            default : defaultEnv || 'local', // default value if nothing is entered
            choices : choices
        };
    }
};
