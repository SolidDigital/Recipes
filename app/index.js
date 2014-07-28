/* jshint node:true */
'use strict';

require('ral').basePath = __dirname;

var app = require('ral')('app'),
    authToken = require('ral')('authToken'),
    express = require('express'),
    expressApp = express(),
    ghApi = require('grasshopper-api'),
    Q = require('q'),
    routes = require('ral')('routes'),
    setup = require('ral')('setup'),
    start = require('ral')('start'),
    configs,
    deferred = Q.defer();

configure();

// TODO: add error handling to the end of the chain
authToken
    .initialize()
    .then(setupRoutes)
    .then(start)
    .done(deferred.resolve);

module.exports = deferred.promise;

// TODO: this can be moved into the config dir
function configure() {
    var viewsDir = __dirname + '/lib/views',
        publicDir = __dirname + '/public';

    configs = ghApi(expressApp);

    if (!configs.router) {
        throw new Error('\n\n\n\n\n >>>>>>>>>>>>>>> npm install to get latest grasshopper-api.\n\n\n\n\n');
    }

    app.initialize({
        bridgetown : configs.bridgetown,
        express : express,
        expressApp : expressApp,
        ghApi : configs.router,
        ghCore : configs.core
    });

    setup.grasshopper();
    setup.express(viewsDir, publicDir);
}

function setupRoutes() {
    routes.setup();
}