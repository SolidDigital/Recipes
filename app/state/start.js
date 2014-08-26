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
    expressApp.engine('jade', require('jade').__express);
    expressApp.set('view engine', 'jade');
    expressApp.set('views', app.rootDir + '/views');
    expressApp.set('view options', { layout: true });
    expressApp.use(express.static(app.rootDir + '/public'));
    app.get('/admin*?', function(request, response) {
        response.sendfile(app.rootDir + '/public/admin/index.html');
    });
    expressApp.use(app.router);
    expressApp.listen(PORT);

    console.log('Service listening on port: ' + PORT + '...');
}
