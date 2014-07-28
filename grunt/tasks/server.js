'use strict';

module.exports = function (grunt) {
    grunt.registerTask('server', function() {
        grunt.task.run(['jshint', 'prompt:server', 'loadGhConfigs', 'shell:start']);
    });
};


