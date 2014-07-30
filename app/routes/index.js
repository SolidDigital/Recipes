'use strict';
var app = require('ral')('app'),
    authToken = require('ral')('authToken'),
    constants = require('ral')('constants'),
    _ = require('lodash'),
    marked = require('marked'),
    Q = require('q'),
    pending = 0;

module.exports = {
    load : load
};

function load() {
    var router = app.express.Router();

    app.router = router;

    router.use('/', displayHomePage);
    router.use(displayRecipe);

    // 404 added as last piece of middleware
    router.use(pageNotFound);
}

function displayHomePage(req, res, next) {
    saturateNodes(null, res, authToken.get(), next);
}

function saturateNodes(nodeId, res, token, next) {
    var ghCore = app.ghCore;

    ++pending;
    console.log('PENDING ::::::::: ' + pending);
    console.log('FETCHING ID:::::: ' + nodeId);
    ghCore
        .request(token)
        .nodes.getChildren(nodeId)
        .then(function(nodes) {
            --pending;
            console.log('\n\n\n\n\n\n');
            console.log('pending', pending);
            console.log('get chilren results for nodeId: ' + nodeId);
            _.each(nodes, function(node) {
                console.log('_ID :::::::::::: ' + node._id);
            });

            _.each(nodes, function(node) {
                saturateNodes(node._id, res, token, next);
            });

            tryToSendResponse(pending, res);
        })
        .catch(next)
        .fail(next);
}

function tryToSendResponse(pending, res) {
    if (!pending) {
        console.log('\n\n\n\n\n\n\n\n\n\nRENDER RENDER RENDER RENDER >>>>>>>>>>>>>');
        res.render('recipe',{
            title : 'Solid Recipes',
            content : '<p>Test</p>',
            node : []});
    }
}

function displayRecipe(req, res, next) {
    var html = '',
        storedResponse,
        slug = req.path,
        ghCore = app.ghCore,
        queryBuilder = app.ghCore.utilities.queryBuilder,
        findSlug = queryBuilder
            .create()
            .equals('fields.computed-slug', slug)
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
                    if (response.title !== section.title) {
                        html+=marked('## ' + section.title + ':');
                    }
                    html+=marked(section.snippet);
                    html+=marked('---');
                    html+=marked('&nbsp;');
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
            if (!arrayOfRecipes) {
                return;
            }
            arrayOfRecipes = _.map(arrayOfRecipes, function(result) {
                return result.fields;
            });

            res.render('recipe',{
                title : response.title,
                content : html,
                node : arrayOfRecipes || []});
        })
        .fail(next);
}

function pageNotFound(req, res) {
    new app.bridgetown.Response(res).writeNotFound();
}