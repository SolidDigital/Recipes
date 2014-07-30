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
    var ghCore = app.ghCore,
        wait = 0;


    ghCore.request(authToken.get())
        .nodes.getChildren(null, true)
        .then(function(nodes) {
            _.each(nodes, function(node) {
                wait+=0;
                setTimeout(function() {
                    ghCore.request(authToken.get())
                        .content.query({
                            nodes: [node._id]
                        })
                        .then(function(rrr) {
                            console.log('THE RESPONSE FOR:::::: ' + node._id);
                            console.log(JSON.stringify(rrr,null,1));
                        });
                }, wait);

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