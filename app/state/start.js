'use strict';
var PORT = process.env.PORT || 3000,
    app = require('ral')('app'),
    marked = require('marked');

marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

module.exports = start;

function start() {
    var express = app.express,
        expressApp = app.expressApp,
        ghApiRouter = app.ghApi;

    expressApp.use('/api', ghApiRouter);
    expressApp.use(express.static(app.rootDir + '/public'));
    expressApp.use(app.router);
    expressApp.listen(PORT);

    console.log('Service listening on port: ' + PORT + '...');
}