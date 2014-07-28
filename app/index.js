/* jshint node:true */
'use strict';

require('ral').basePath = __dirname;

var PORT = process.env.PORT || 3000,
    app = require('ral')('app'),
    authToken = require('ral')('authToken'),
    express = require('express'),
    expressApp = express(),
    ghApi = require('grasshopper-api'),
    Q = require('q'),
    configs = ghApi(expressApp),
    deferred = Q.defer();

app.initialize({
    bridgetown : configs.bridgetown,
    express : express,
    expressApp : expressApp,
    ghApi : configs.router,
    ghCore : configs.core
});

authToken
    .initialize()
    .then(start)
    .fail(deferred.reject)
    .catch(deferred.reject)
    .done(deferred.resolve);

module.exports = deferred.promise;
module.exports.fail(console.log);
module.exports.catch(console.log);

function start() {
    var express = app.express,
        expressApp = app.expressApp,
        ghApiRouter = app.ghApi;

    expressApp.use('/api', ghApiRouter);
    expressApp.use(express.static(__dirname + '/public'));

    app.expressApp.listend(PORT);
    console.log('Service listening on port: ' + PORT + '...');
}