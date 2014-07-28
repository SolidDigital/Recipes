'use strict';

module.exports = function (grunt) {
    grunt.registerTask('server', function() {
        grunt.task.run(['loadGhConfigs', 'shell:start']);
    });
};


