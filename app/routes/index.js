'use strict';
var app = require('ral')('app'),
    path = require('path'),
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
    router.use(displayDirectoryNew);
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

function displayDirectoryNew(req, res, next) {
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

    console.log('~~~~~~~');

    core.request(authToken.get())
        .nodes.getChildren(null, true)
        .then(function(nodes) {
            console.log('got children');
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
                    console.log('got node contents');
                    nodeContents = nodeContents.map(function(node) {
                        return node.value;
                    });
                    nodes = _.zip(nodes, nodeContents).map(function(node) {
                        var newNode = node[0];
                        newNode.contents = node[1];
                        return newNode;
                    });
                    console.log('resolving with contents');
                    deferred.resolve(nodes);
                });

            return deferred.promise; })
        .then(createTree)
        .then(function(tree) {
            return findSubtree(tree, slug);
        })
        .then(function(subtree) {
            var go = true,
                depth = 0,
                md = '';

            md = addDirectories(subtree, md, depth);
            md = addLinks(subtree, md, depth);

            console.log(md);
            res.render('recipe',{
                title : subtree.title,
                content : marked(md),
                node : []});
        })
        .catch(function(error) {
            console.log(error);
            next();
        });
}

function addDirectories(subtree, md, depth) {
    var spacer = '';

    while (depth) {
        spacer += '    ';
        --depth;
    }

    _.each(subtree, function(value, key) {
        if (key === 'href' || key === 'contents' || key === 'label') {
            return;
        }

        md += '* [' + value.label + '](' + value.href + ')\n';
    });

    return md;
}

function addLinks(subtree, md, depth) {
    var spacer = '';

    while (depth) {
        spacer += '    ';
        --depth;
    }

    _.each(subtree.contents, function(value) {
        md += '* [' + value.label + '](' + value.href + ')\n';
    });

    return md;
}

function findSubtree(tree, slugs) {
    var subtree = tree;
    console.log('slugs',slugs);

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
    console.log('created tree');
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

/**
 * See if a directory listing should be displayed.
 * If it should, do it.
 * If it shouldn't, do nothing and call the next middleware.
 * @param req
 * @param res
 * @param next
 */
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
                routedTo = {
                    label : 'Home',
                    _id : null
                };
            }
            return routedTo; })
        .then(function(node) {
            return core.request(authToken.get())
                .nodes.getChildren(node._id, true);})
        .then(function(nodes) {

            console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n-------');
            console.log('-------');
            console.log('-------');
            console.log('-------');
            console.log('-------');
            console.log('-------');
            console.log('-------');
            console.log('--- nodes');
            console.log(JSON.stringify(nodes,null,1));
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

            keypath = slug.slice(1).replace(/\//g,'.');
            console.log('keypath', keypath);
            console.log('slug', slug);
            console.log(JSON.stringify(newNodes,null,1));
            console.log('^^^^ new nodes');
            dotGetterSetter.detach(newNodes);
            content = createDirListing(keypath ? dotGetterSetter.get(newNodes,keypath) : newNodes, '', '', slug);

            res.render('recipe',{
                title : title,
                content : marked(content),
                node : []});
        })
        // Cannot call next w an error, unless you want it bubble up to a 500
        .fail(function() {
            next();
        })
        .done();
}

function createDirListing(theNode, prefix, content, slug) {

    if (theNode.links) {

        _.each(theNode.links, function(link) {
            content += prefix + '* [' + link.title + '](' + link.slug + ')\n';
        });
    }

    delete theNode.links;

    _.each(theNode, function(node, label) {
        var newSlug = slug + ('/' === slug ? '' : '/') + label;

        content += prefix + '* [' + label + '](' + newSlug + ')\n';
        content = createDirListing(node, '   ' + prefix, content, newSlug);
    });
    return content;
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

function getNodeSetter(node) {
    return (_.map(node.ancestors, function(ancestor) {
        return ancestor.label;
    }).join('.'));
}