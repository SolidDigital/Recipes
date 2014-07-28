'use strict';
var PORT = process.env.PORT || 3000,
    app = require('ral')('app');

module.exports = start;

function start() {
    var express = app.express,
        expressApp = app.expressApp,
        ghApiRouter = app.ghApi;

    expressApp.use('/api', ghApiRouter);
    expressApp.use(express.static(__dirname + '/public'));
    expressApp.listen(PORT);

    console.log('Service listening on port: ' + PORT + '...');
}