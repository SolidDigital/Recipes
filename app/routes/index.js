'use strict';
var app = require('ral')('app'),
    authToken = require('ral')('authToken'),
    constants = require('ral')('constants'),
    _ = require('lodash'),
    marked = require('marked'),
    Q = require('q');

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
        storedResponse,
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
            var promises;
            if (1 === response.results.length) {
                response = response.results[0].fields;
                storedResponse = response;
                _.each(response.sections, function(section) {
                    html+=marked(section.snippet);
                });
                promises = _.map(response.recipes, function(recipeId) {
                    return ghCore
                        .request(authToken.get())
                        .content.getById(recipeId);
                });
                return Q.all(promises);
            } else {
                next();
            }
        })
        .then(function(arrayOfRecipes) {
            var response = storedResponse || {};
            arrayOfRecipes = _.map(arrayOfRecipes, function(result) {
                return result.fields;
            });

            res.render('recipe',{
                title : response.title,
                content : html,
                node : arrayOfRecipes});
        })
        .fail(next);
}

function pageNotFound(req, res) {
    new app.bridgetown.Response(res).writeNotFound();
}