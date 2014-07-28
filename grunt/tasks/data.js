module.exports = function (grunt) {
    'use strict';

    var _ = require('lodash'),
        path = require('path'),
        sep = path.sep,
        databases = require('./databases');

    grunt.registerTask('data:deleteTemp', function() {
        grunt.file.delete('.data');
    });

    // Save
    grunt.registerTask('data:save', function () {
        grunt.task.run('data:save:write:grasshopper');
    });

    grunt.registerTask('data:save:write', function (database) {

        var tasks = [];
        grunt.config.set('database', database);
        grunt.config.set('fixtureFolder', getFixtureFolder());
        grunt.config.set('mongo', getMongoConfigs());

        _.each(databases[database].collections, function (collection) {
            console.log('setting collection to: ' + collection);
            tasks.push('data:set:collection:' + collection);
            tasks.push('shell:mongoExport');
            tasks.push('data:prettify:collection:' + collection);
        });
        grunt.task.run(tasks);

    });

    // Utilities
    grunt.registerTask('data:set:collection', 'Helper task', function (collection) {
        grunt.log.writeln('collection: ' + collection);
        grunt.config.set('collection', collection);
    });
    grunt.registerTask('data:prettify:collection', 'Helper task', function (collection) {
        var filePath = grunt.config.get('fixtureFolder') + '/' + collection,
            collectionData = grunt.file.readJSON('.data' + path.sep + filePath + '.json');

        _.each(collectionData, function(collectionItem) {
            grunt.file.write('fixtures' + path.sep + filePath + path.sep + collectionItem._id.$oid + '.json',
                JSON.stringify(collectionItem, null, 4));
        });

        grunt.file.delete('.data');
    });

    function getFixtureFolder() {
        return grunt.config.get('database');
    }

    function getMongoConfigs() {
        return require('../../ghapi.json').db;
    }
};
