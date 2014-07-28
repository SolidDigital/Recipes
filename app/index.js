/* jshint node:true */
'use strict';

require('ral').basePath = __dirname;

var app = require('ral')('app'),
    start = require('ral')('start'),
    authToken = require('ral')('authToken'),
    routes = require('ral')('routes'),
    express = require('express'),
    expressApp = express(),
    ghApi = require('grasshopper-api'),
    Q = require('q'),
    configs = ghApi(expressApp),
    deferred = Q.defer();

Q.longStackSupport = true;

app.initialize({
    bridgetown : configs.bridgetown,
    express : express,
    expressApp : expressApp,
    ghApi : configs.router,
    ghCore : configs.core,
    rootDir : __dirname
});

authToken
    .initialize()
    .then(routes.load)
    .then(start)
    .fail(deferred.reject)
    .catch(deferred.reject)
    .done(deferred.resolve);

module.exports = deferred.promise;
module.exports.fail(stack.bind(null,'fail'));
module.exports.catch(stack.bind(null,'catch'));

function stack(type, error) {
    console.log('\n\n\n\n' + type + ':');
    console.log(error.stack);
}