'use strict';
var app = require('ral')('app'),
    authToken = require('ral')('authToken'),
    constants = require('ral')('constants'),
    _ = require('lodash'),
    marked = require('marked'),
    prefix = '<link rel="stylesheet" href="/highlight/ir_black.min.css">' +
        '<script src="/highlight/highlight.min.js"></script>' +
                '<script>hljs.initHighlightingOnLoad();</script>';

module.exports = {
    load : load
};

function load() {
    var router = app.express.Router();

    app.router = router;

    router.use(displayRecipe);

    // 404 added as last piece of middleware
    router.use(pageNotFound);
}

function displayRecipe(req, res, next) {
    var html = '',
        slug = req.path,
        ghCore = app.ghCore,
        queryBuilder = app.ghCore.utilities.queryBuilder,
        findSlug = queryBuilder
            .create()
            .equals('fields.slug', slug)
            .inTypes([constants.ids.recipes])
            .build();

    ghCore
        .request(authToken.get())
        .content.query(findSlug)
        .then(function(response) {
            if (1 === response.results.length) {
                response = response.results[0].fields;
                _.each(response.sections, function(section) {
                    // TODO: use a jade tempalte instead
                    html+=prefix;

                    html+=marked(section.snippet);

                });
                res.send(html);
            } else {
                next();
            }
        })
        .fail(next);
}

function pageNotFound(req, res) {
    new app.bridgetown.Response(res).writeNotFound();
}