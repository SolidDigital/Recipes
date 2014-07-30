'use strict';
var app = require('ral')('app'),
    authToken = require('ral')('authToken'),
    constants = require('ral')('constants'),
    _ = require('lodash'),
    marked = require('marked'),
    Q = require('q'),
    dotGetterSetter = require('ral')('dotGetSet');

module.exports = {
    load : load
};

function load() {
    var router = app.express.Router();

    app.router = router;

    router.use(getSlug);
    router.use(displayRecipe);
    router.use(displayDirectory);
    router.use(pageNotFound);
}

function displayRecipe(req, res, next) {
    var html = '',
        storedResponse,
        slug = req.slug,
        ghCore = app.ghCore;

    ghCore
        .request(authToken.get())
        .content.query(findSlug(slug))
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

function displayDirectory(req, res, next) {
    var core = app.ghCore,
        slug = req.slug,
        content = '',
        title;

    core.request(authToken.get())
        .nodes.getChildren(null, true)
        .then(function(nodes) {
            var routedTo = _.find(nodes, function(node) {
                node.ancestors.push({
                    label : node.label
                });
                return slug === getNodeSlug(node);
            });

            if (!routedTo) {
                throw new Error('Cannot find routed to node.');
            }
            title = routedTo.label;
            return routedTo; })
        .then(function(node) {
            return core.request(authToken.get())
                .nodes.getChildren(node._id, true);})
        .then(function(nodes) {
            return Q.all(_.map(nodes, function(node) {
                return core.request(authToken.get())
                    .content.query(findInNode(node._id))
                    .then(function(contents) {
                        contents.inNode = node;
                        contents.allNodes = nodes;
                        return contents;
                    });
            }));
        })
        .then(function(contentsResultsArray) {
            var nodes = contentsResultsArray[0].allNodes,
                keypath,
                newNodes = {};

            dotGetterSetter.attach(newNodes);

            _.each(contentsResultsArray, function(searchResult) {
                var node = _.find(nodes, function(node) {
                    return node._id === searchResult.inNode._id;
                });
                if (node) {
                    node.links = node.links || [];
                    _.each(searchResult.results, function(content) {
                        node.links.push({
                            title : content.fields.title,
                            slug : content.fields['computed-slug']
                        });
                    });
                }
            });

            _.each(nodes, function(node) {
                var info = {};
                if (node.title) {
                    info.title = node.title;
                }
                if (node.links) {
                    info.links = node.links;
                }
                if (node.slug) {
                    info.slug = node.slug;
                }
                newNodes.set(getNodeSetter(node), info);
            });


            console.log('--------');
            console.log('--------');
            console.log('--------');
            console.log('--------');
            console.log('--------');
            console.log(JSON.stringify(newNodes,null,4));
            console.log('^^^^^');
            console.log('^^^^^');
            console.log('^^^^^');
            console.log('^^^^^');
            console.log('^^^^^');

            keypath = slug.slice(1).replace(/\//g,'.');
            console.log('keypath:' + keypath);
            content = createDirListing(newNodes.get(keypath), '', '', slug);


            res.render('recipe',{
                title : title,
                content : marked(content),
                node : []});
        })
        // Cannot call next w an error, unless you want it bubble up to a 500
        .fail(function() {
            console.log('slug:eeeeeee',slug);
            next();
        })
        .done();
}

function createDirListing(theNode, prefix, content, slug) {

    console.log('starting slug: ' + slug);
    console.log(theNode);
    console.log('---');
    if (theNode.links) {

        console.log('inside');
        _.each(theNode.links, function(link) {
            console.log('title' + link.title);
            console.log('slug' + link.slug);
            content += prefix + '* [' + link.title + '](' + link.slug + ')\n';
        });
    }

    delete theNode.links;

    console.log('starting child nodes');
    _.each(theNode, function(node, label) {
        var newSlug = slug + '/' + label;
        content += prefix + '* DIR: [' + label + '](' + newSlug + ')\n';
        content = createDirListing(node, '   ' + prefix, content, newSlug);
    });
    console.log('end');
    return content;
}

function getSlug(req, res, next) {
    req.slug = req.path;
    next();
}

function pageNotFound(req, res) {
    res.render('recipe',{
        title : 'Page Not Found',
        content : '<h2>Error 404</h2><p>Try again, or go <a href="/">home</a>.</p>',
        node : []});
}

function findSlug(slug) {
    var queryBuilder = app.ghCore.utilities.queryBuilder;
    return queryBuilder
        .create()
        .equals('fields.computed-slug', slug)
        .inTypes([constants.ids.recipes])
        .build();
}

function findInNode(nodeId) {
    var queryBuilder = app.ghCore.utilities.queryBuilder;
    return queryBuilder
        .create()
        .inNodes([nodeId])
        .build();
}

function getNodeSlug(node) {
    return '/'+(_.map(node.ancestors, function(ancestor) {
        return ancestor.label;
    }).join('/'));
}

function getNodeSetter(node) {
    return (_.map(node.ancestors, function(ancestor) {
        return ancestor.label;
    }).join('.'));
}