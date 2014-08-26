'use strict';
var app = require('ral')('app'),
    path = require('path'),
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

    router.use(getSlug);
    router.use(displayRecipe);
    router.use(displayDirectory);
    router.use(pageNotFound);
}

/**
 * See if there is a recipe at this slug.
 * If there is, display it.
 * If there is not, do nothing and call the next middleware.
 * @param req
 * @param res
 * @param next
 */
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
                    html+=marked(section.snippet || '');
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
    var slug = req.slug,
        core = app.ghCore,
        home = [] === req.slug;


    if (undefined === slug) {
        next();
        return;
    }

    if (!home) {
        slug = req.slug.slice(1).split('/');
    }

    core.request(authToken.get())
        .nodes.getChildren(null, true)
        .then(function(nodes) {
            return _.map(nodes, function(node) {
                return {
                    _id : node._id,
                    href : getNodeSlug(node),
                    label : node.label
                };
            }); })
        .then(function(nodes) {
            var deferred = Q.defer();

            Q
                .allSettled(nodes.map(function(node) {
                    return findInNode(node); }))
                .then(function(nodeContents) {
                    nodeContents = nodeContents.map(function(node) {
                        return node.value;
                    });
                    nodes = _.zip(nodes, nodeContents).map(function(node) {
                        var newNode = node[0];
                        newNode.contents = node[1];
                        return newNode;
                    });
                    deferred.resolve(nodes);
                });

            return deferred.promise; })
        .then(createTree)
        .then(function(tree) {
            return findSubtree(tree, slug);
        })
        .then(function(subtree) {
            var depth = 0,
                md = '';

            md = addSubtree(subtree, md, depth);

            res.render('recipe',{
                title : subtree.label || 'home',
                content : marked(md),
                node : []});
        })
        .catch(function() {
            next();
        });
}

function addSubtree(subtree, md, depth) {
    md = addDirectories(subtree, md, depth);
    return md;
}

function addDirectories(subtree, md, depth) {
    var spacer = '',
        originalDepth = depth;

    while (depth) {
        spacer += '    ';
        --depth;
    }

    _.each(subtree, function(value, key) {
        if (key === 'href' || key === 'contents' || key === 'label') {
            return;
        }

        md += spacer + '* [' + value.label + '](' + value.href + ')\n';
        md = addSubtree(value, md, originalDepth + 1);
    });

    md = addLinks(subtree, md, originalDepth);
    return md;
}

function addLinks(subtree, md, depth) {
    var spacer = '';

    while (depth) {
        spacer += '    ';
        --depth;
    }

    _.each(subtree.contents, function(value) {
        md += spacer + '* [' + value.label + '](' + value.href + ')\n';
    });

    return md;
}

function findSubtree(tree, slugs) {
    var subtree = tree;

    while (slugs.length) {
        subtree = subtree[slugs.shift()];
        if (!subtree) {
            return tree;
        }
    }
    return subtree;
}

/**
 *
 *  {
 *      docs : {
 *          js : {
 *              content : []
 *          }
 *      }
 *  }
 *
 */
function createTree(nodes) {
    var tree = {};
    _.each(nodes, function(node) {
        addLeaf(tree, node);
    });
    return tree;
}

function addLeaf(tree, node) {
    var slugs = _.compact(node.href.split('/')),
        first,
        subtree = tree;

    // Create the leaf to be added to
    while (slugs.length) {
        first = slugs.shift();

        if (!subtree[first]) {
            subtree[first] = {};
        }

        subtree = subtree[first];
    }

    subtree.href = node.href;
    subtree.label = node.label;
    subtree.contents = node.contents;
}

function getSlug(req, res, next) {

    if (!path.extname(req.path)) {
        req.slug = req.path;
    }
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

function findInNode(node) {
    var deferred = Q.defer();
    app.ghCore
        .request(authToken.get())
        .content.query(findInNodeQuery(node))
        .then(function(results) {
            results = results.results;
            results = results.map(function(result) {
                return {
                    href : result.fields['computed-slug'],
                    label : result.fields.title
                };
            });
            deferred.resolve(results);
        });
    return deferred.promise;
}

function findInNodeQuery(node) {
    var queryBuilder = app.ghCore.utilities.queryBuilder,
        nodeId = node._id;

    return queryBuilder
        .create()
        .inNodes([nodeId])
        .build();
}

function getNodeSlug(node) {
    return '/' + (_.map(node.ancestors.concat([node]), function(ancestor) {
        return ancestor.label;
    }).join('/'));
}
